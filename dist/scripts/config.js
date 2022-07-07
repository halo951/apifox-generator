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
exports.ConfigLoader = void 0;
const np = __importStar(require("path"));
const fs = __importStar(require("fs"));
const axios_1 = __importDefault(require("axios"));
const input_1 = require("./utils/input");
/** Api 映射文件 生成器 */
class ConfigLoader {
    static configFilePath = ['apifox.rule.json'].map((r) => np.join(process.cwd(), r));
    static treeNodeListApi = 'https://api.apifox.cn/api/v1/api-tree-list?locale=zh-CN';
    static detailsApi = 'https://api.apifox.cn/api/v1/api-details?locale=zh-CN';
    static loginApi = 'https://api.apifox.cn/api/v1/login?locale=zh-CN';
    /** 配置 */
    config;
    /** 配置文件存储地址 */
    configPath;
    async exec() {
        // 获取是否存在配置文件
        const config = this.loadConfig();
        this.config = config;
        // 配置输出文件目录
        await this.setOutDir();
        // 选择接口模板
        await this.setRequestTemplate();
        // 判断是否存在项目ID
        if (!this.config.projectId) {
            // 通过控制台输入配置
            const projectId = await (0, input_1.inputText)('配置 projectId (从apifox web端查看):');
            this.config.projectId = projectId;
            this.updateConfig();
        }
        if (!this.config.Authorization) {
            const token = await this.login();
            this.config.Authorization = token;
            this.updateConfig();
        }
        // 读取 treeNode, details
        const treeNode = await this.loadApiTreeNode();
        const details = await this.loadApiDetails();
        // 获取可用接口范围
        const folders = this.readApisDirectory(treeNode);
        // 与 config 中的 folders diff, 并更新引用
        const upgraded = this.upgradeConfigFolders(folders);
        // 如果不存在选中接口范围, 用户输入
        await this.selectUsageApiDoc(upgraded);
        return {
            config: this.config,
            treeNode,
            details
        };
    }
    loadConfig() {
        let config;
        for (const p of ConfigLoader.configFilePath) {
            try {
                if (!fs.existsSync(p))
                    continue;
                const fi = fs.readFileSync(p, { encoding: 'utf-8' });
                config = JSON.parse(fi);
                this.configPath = p;
                return config;
            }
            catch (error) {
                // skip
            }
        }
        return {};
    }
    updateConfig() {
        let outFilePath = this.configPath ?? ConfigLoader.configFilePath[0];
        fs.writeFileSync(outFilePath, JSON.stringify(this.config, null, 4), { encoding: 'utf-8' });
    }
    async login(count = 0) {
        console.log('> 当前项目未登录, 请登录');
        const account = await (0, input_1.inputText)('输入账号:');
        const password = await (0, input_1.inputText)('输入密码:');
        let res;
        try {
            res = await (0, axios_1.default)({
                method: 'post',
                url: ConfigLoader.loginApi,
                headers: {
                    Origin: 'https://www.apifox.cn',
                    'X-Client-Mode': 'web',
                    'X-Client-Version': '2.1.17-alpha.3',
                    'X-Device-Id': 'xW9HUp7S8CME0TSuW8t5yc5MEyeYw2uHq0R71neRktaketlfC9UQOGcwwOpyED43'
                },
                data: {
                    account,
                    password
                }
            });
        }
        catch (error) {
            const confirmed = await (0, input_1.inputConfirm)('登录失败, 是否打印错误信息:');
            if (confirmed)
                console.log(error);
        }
        if (res.status !== 200 || !res.data.success) {
            console.log('请求 apifox 失败');
            process.exit(-1); // stop thread
        }
        if (res.data?.data?.accessToken) {
            return res.data.data.accessToken;
        }
        else {
            if (count > 5) {
                console.log('失败次数超过5次, 退出');
                process.exit(-1); // stop thread
            }
            console.log('> 登录失败, 请重试');
            return await this.login(count + 1);
        }
    }
    async loadApiTreeNode() {
        const res = await (0, axios_1.default)({
            url: ConfigLoader.treeNodeListApi,
            headers: {
                Origin: 'https://www.apifox.cn',
                Authorization: this.config.Authorization,
                'X-Project-Id': this.config.projectId,
                'X-Client-Mode': 'web',
                'X-Client-Version': '2.1.17-alpha.3',
                'X-Device-Id': 'xW9HUp7S8CME0TSuW8t5yc5MEyeYw2uHq0R71neRktaketlfC9UQOGcwwOpyED43'
            }
        });
        if (res.status !== 200 || !res.data.success) {
            console.log('> 读取 tree node 时出错!');
            process.exit(-1); // stop thread
        }
        return res.data.data;
    }
    async loadApiDetails() {
        const res = await (0, axios_1.default)({
            url: ConfigLoader.detailsApi,
            headers: {
                Origin: 'https://www.apifox.cn',
                Authorization: this.config.Authorization,
                'X-Project-Id': this.config.projectId,
                'X-Client-Mode': 'web',
                'X-Client-Version': '2.1.17-alpha.3',
                'X-Device-Id': 'xW9HUp7S8CME0TSuW8t5yc5MEyeYw2uHq0R71neRktaketlfC9UQOGcwwOpyED43'
            }
        });
        if (res.status !== 200 || !res.data.success) {
            console.log('> 读取 details 时出错!');
            process.exit(-1); // stop thread
        }
        return res.data.data;
    }
    /** 读取api文件夹 */
    readApisDirectory(nodeTree, folders = []) {
        for (const item of nodeTree) {
            if (item.folder) {
                folders.push({ id: item.folder.id, name: item.name });
            }
            if (item.children) {
                this.readApisDirectory(item.children, folders);
            }
        }
        return folders;
    }
    /** 更新接口引用 */
    upgradeConfigFolders(folders) {
        this.config.floders = this.config.floders || [];
        const differenceSet = folders.filter((item) => !this.config.floders.some((ele) => ele.id === item.id));
        if (differenceSet.length > 0) {
            this.config.floders = folders;
        }
        this.updateConfig();
        return differenceSet.length > 0;
    }
    /** 选择使用的接口文档集合 */
    async selectUsageApiDoc(upgraded) {
        this.config.usage = this.config.usage || [];
        // 如果接口引用配置未修改, 且已配置接口规则, 则跳过这一步骤
        if (!upgraded && this.config.usage.length > 0)
            return;
        const list = (await (0, input_1.inputMultiSelect)('选择需要生成的接口', this.config.floders.map((f) => {
            return { title: f.name, value: f };
        })));
        console.log('> 配置接口命名映射');
        for (const item of list) {
            // ? 已配置过的, 跳过
            if (this.config.usage.find((u) => u.id === item.id))
                continue;
            const mapFile = await (0, input_1.inputText)(`配置接口映射文件名: (接口: ${item.name})`);
            item.mapFile = mapFile;
        }
        this.config.usage = list;
        this.updateConfig();
    }
    async setOutDir() {
        if (this.config.outDir)
            return;
        const outDir = await (0, input_1.inputText)('配置输出文件路径');
        this.config.outDir = outDir;
        this.updateConfig();
    }
    async setRequestTemplate() {
        if (this.config.requestTemplate)
            return;
        console.log(`
            -------------------------------------------
            > plan 'request util' (建议, 但需要实现)
            - header
            import { IResponse, request } from '@/utils/request'
            - request syntax
            request.post('[api url]', params)
            - response interafce syntax
            export interface IApiResponse extends IResponse {
                /** 在IResponse基础上, 扩展 response接口内容 */
            }
            -------------------------------------------            
            > plan 'basic axios'
            - header 
            import axios from 'axios'
            - request syntax
            axios.post('[api url]', params)
            - response interafce syntax
            export interface IApiResponse {
                /** 包含接口响应值的所有信息 */
            }
            -------------------------------------------

            注: 除了上述2种方式之外, 还可以在配置文件中, 修改语法模板. 
            `
            .split(/\n/g)
            .map((l) => l.trim())
            .join('\n'));
        const plan = await (0, input_1.inputSelect)('选择使用的 Request 工具模板', [
            { title: 'request util (建议)', value: 'request util' },
            { title: 'basic axios', value: 'basic util' }
        ]);
        if (plan === 'request util') {
            this.config.requestTemplate = {
                name: 'request util',
                headerComment: `
                /** 接口集合 - [folder name]
                 * 
                 * @apifox [apifox address]
                 * @author apifox-generator
                 * @date (最后一次更新日期) [last update]
                 */
                `,
                importSyntax: `import { request, IResponse } from '@/utils/request'`,
                requestUtil: 'request',
                responseExtend: 'IResponse',
                globalParamsKey: [],
                globalResponseKey: []
            };
        }
        else {
            this.config.requestTemplate = {
                name: 'basic axios',
                headerComment: `
                /** 接口集合 - [folder name]
                 * 
                 * @apifox [apifox address]
                 * @author apifox-generator
                 * @date (最后一次更新日期) [last update]
                 */
                `,
                importSyntax: `import axios from 'axios'`,
                requestUtil: 'axios',
                responseExtend: null,
                globalParamsKey: [],
                globalResponseKey: []
            };
        }
        this.updateConfig();
    }
}
exports.ConfigLoader = ConfigLoader;
