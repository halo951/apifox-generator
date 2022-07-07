"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const fs = __importStar(require("fs"));
const np = __importStar(require("path"));
const json2ts = __importStar(require("json-schema-to-typescript"));
const fs_extra_1 = require("fs-extra");
const prettier_1 = __importDefault(require("prettier"));
const dayjs_1 = __importDefault(require("dayjs"));
const eslint_1 = require("eslint"); // 通过eslint + prettier + @typescript-eslint 格式化 输出文件
const prettier_config_1 = __importDefault(require("./data/prettier.config"));
const formatToHump = (value) => {
    return value.replace(/[\_\-](\w)/g, (_, letter) => letter.toUpperCase());
};
const formatInterfaceName = (value, suffix) => {
    value = formatToHump(value);
    value = value.replace(/^([\w])/, (_, $1) => $1.toUpperCase());
    return `I${value}${suffix}`;
};
const transform = (schema, globalKey) => {
    for (const key in schema) {
        console.log(key);
        // add additionalProperties at false
        if (key === 'type')
            schema['additionalProperties'] = false;
        if (key === 'properties') {
            for (const k in schema['properties']) {
                const prop = schema['properties'][k];
                // remove global key
                if (globalKey.includes(k)) {
                    delete schema['properties'][k];
                }
                // title to description
                if (prop.title) {
                    if (prop.description) {
                        prop.description = prop.title + ' | ' + prop.description;
                    }
                    else {
                        prop.description = prop.title;
                    }
                    delete prop.title;
                }
            }
        }
        // deep object
        if (typeof schema[key] === 'object')
            transform(schema[key], globalKey);
    }
};
const trimByLine = (str) => {
    return str
        .split(/\n/g)
        .map((s) => s.trim())
        .join('\n');
};
/** 基于 apifox 定义的接口生成器逻辑 */
class Generator {
    config;
    details;
    eslint = new eslint_1.ESLint({
        fix: true,
        overrideConfig: {
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint', 'prettier'],
            rules: {
                'prettier/prettier': [2],
                '@typescript-eslint/array-type': [2, { default: 'generic' }]
            }
        }
    });
    async exec(config, treeNode, details, mock) {
        this.config = config;
        this.details = details;
        const { outDir, usage } = config;
        const cache = [];
        // ? 遍历并生成文件集合
        for (const { id, name, mapFile } of usage) {
            // 从 treeNode 中, 拿到当前 folder 的子集
            const apis = this.findApisByFolder(treeNode, id);
            // 转换为接口生成需要的信息
            const maps = [];
            for (const { detail } of apis) {
                const info = await this.transformApiInfo(detail);
                maps.push(info);
            }
            // 生成文件头
            const header = this.generateHeader(name);
            // 生成文件内容
            const context = this.generateContext(name, maps);
            // 存入缓冲区
            cache.push({ mapFile, header, context });
        }
        // 输出文件
        for (const c of cache)
            await this.outputFile(outDir, c.mapFile, c.header, c.context);
    }
    /** 从treeNode中, 获取folder下所有接口集合 */
    findApisByFolder(treeNode, id) {
        let apis = [];
        for (const node of treeNode) {
            if (id && node.folder?.id !== id)
                continue;
            for (const api of node.children) {
                if (api.type === 'apiDetailFolder') {
                    let children = this.findApisByFolder(api.children, id);
                    apis = apis.concat(children);
                }
                else {
                    const detail = this.details.find((d) => d.id === api.api.id);
                    apis.push({ node: api, detail });
                }
            }
        }
        return apis;
    }
    /** 转换元数据为生成接口需要的信息 */
    async transformApiInfo(detail) {
        const { method, path, name, createdAt, updatedAt } = detail;
        const { globalParamsKey, globalResponseKey } = this.config.requestTemplate;
        const basename = formatToHump(np.basename(path));
        const paramsInterfaceName = formatInterfaceName(np.basename(path), 'Params');
        let responseInterfaceName = formatInterfaceName(np.basename(path), 'Response');
        console.log('convert');
        transform(detail.requestBody.jsonSchema, globalParamsKey);
        let params = '';
        if (Object.keys(detail.requestBody?.jsonSchema?.properties || {}).length > 0) {
            params = await json2ts.compile(detail.requestBody.jsonSchema, paramsInterfaceName, {
                bannerComment: ``,
                unreachableDefinitions: true,
                declareExternallyReferenced: true,
                ignoreMinAndMaxItems: true
            });
        }
        else {
            params = null;
        }
        const responseNames = [];
        const responses = [];
        for (const resp of detail.responses) {
            transform(resp.jsonSchema, globalResponseKey);
            const rin = responseInterfaceName + (responses.length > 0 ? responses.length : '');
            const response = await json2ts.compile(resp.jsonSchema, rin, {
                bannerComment: ``,
                unreachableDefinitions: true,
                declareExternallyReferenced: true,
                ignoreMinAndMaxItems: true
            });
            responseNames.push(rin);
            responses.push(response);
        }
        return {
            method,
            path,
            name,
            basename,
            createdAt,
            updatedAt,
            hasParams: !!params,
            params: params,
            responses: responses,
            paramsName: paramsInterfaceName,
            responseNames
        };
    }
    /** 基于模板生成文件结构 */
    generateHeader(folderName) {
        const { importSyntax, headerComment } = this.config.requestTemplate;
        let template = ``;
        // import 语句
        template += importSyntax;
        template += '\n';
        // header 注释
        template += headerComment;
        template += '\n';
        template = template
            .replace(/\[folder name\]/g, folderName)
            .replace(/\[apifox address\]/g, `https://www.apifox.cn/web/project/${this.config.projectId}`)
            .replace(/\[last update\]/, (0, dayjs_1.default)().format('YYYY-MM-DD HH:mm'));
        template += '\n\n';
        return trimByLine(template);
    }
    /** 生成文件内容 */
    generateContext(name, maps) {
        const { requestUtil } = this.config.requestTemplate;
        let context = '';
        for (const info of maps) {
            // 添加 params interface
            context += `/** params interface | ${info.name} */`;
            context += '\n';
            context += info.params;
            context += '\n';
            // 添加 response interface
            context += `/** response interface | ${info.name} */`;
            context += '\n';
            context += info.responses.join('\n');
            context += '\n';
            // 添加 request function
            const usageParams = info.hasParams ? ', params' : '';
            const apiPath = `'${info.path}'`;
            let requestFunction = `
                /** ${name} - ${info.name}
                 * 
                 * [params comment]
                 * @updateAt ${(0, dayjs_1.default)(info.updatedAt).format('YYYY-MM-DD HH:mm')}
                 */
                export const ${info.basename} = async ([params]) [response name] => {
                    return ${requestUtil}.${info.method.toLowerCase()}(${apiPath}${usageParams})
                }
            `;
            // 替换 api path
            requestFunction = requestFunction.replace(/\[api url\]/, info.path);
            // 替换参数
            if (info.hasParams) {
                requestFunction = requestFunction.replace(/\[params comment\]/, `@param {${info.paramsName}} params`);
                requestFunction = requestFunction.replace(/\[params\]/, `params: ${info.paramsName}`);
            }
            else {
                requestFunction = requestFunction.replace(/\[params comment\]/, '');
                requestFunction = requestFunction.replace(/\[params\]/, ``);
            }
            if (info.responseNames.length > 0) {
                requestFunction = requestFunction.replace(/\[response name\]/, ': Promise<' + info.responseNames.join(' | ') + '>');
            }
            else {
                requestFunction = requestFunction.replace(/\[response name\]/, '');
            }
            context += requestFunction;
            context += '\n\n';
        }
        context = context.replace(/\/\*\*\n.+?\* (.*)\n.*\*\//g, (sub, $1) => {
            return `/** ${$1} */`;
        });
        return context;
    }
    /** 输出文件 */
    async outputFile(outDir, mapFile, header, context) {
        // 检查输出目录是否存在, 不存在创建
        (0, fs_extra_1.mkdirsSync)(outDir);
        // 循环输出文件 (执行prettier格式化)
        let out = header + '\n' + context;
        out = (await this.eslint.lintText(out, {}))[0].output;
        out = prettier_1.default.format(out, { parser: 'typescript', ...prettier_config_1.default });
        let outName = np.join(outDir, mapFile);
        if (np.extname(outName) !== '.ts')
            outName += '.ts';
        fs.writeFileSync(outName, out, { encoding: 'utf-8' });
    }
}
exports.Generator = Generator;
