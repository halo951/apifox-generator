import * as fs from 'fs'
import * as np from 'path'
import * as json2ts from 'json-schema-to-typescript'

import prettier from 'prettier'
import dayjs from 'dayjs'
import { mkdirsSync } from 'fs-extra'
import { GroupBy } from 'array-grouping'
import chalk from 'chalk'
import typescript, { ModuleKind, ScriptTarget } from 'typescript'
import { Linter } from 'eslint'
import { rules } from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'

import { IConfig } from './intf/IConfig'
import { IDetail } from './intf/IDetail'
import { ITreeNode } from './intf/ITreeData'
import { IApiOriginInfo } from './intf/IApiOriginInfo'

import { getPrettierConfig } from './utils/prettier.config'
import {
    transform,
    appendParentInterface,
    transformSchemaRef,
    removeDeprecatedApi,
    transformPathParamsToJsonScheam
} from './utils/schema'
import {
    formatInterfaceName,
    formatNameByDisabledKeyword,
    formatNameSuffixByDuplicate,
    formatToHump,
    splitLongNameByPath,
    splitLongCamelCaseNameByPath,
    urlLastParagraph
} from './utils/format'
import { point } from './utils/point'
import { loading, step } from './utils/decorators'
import { Configure } from './configure'

type TCache = Array<{ moduleName: string; comment: string; mapFile: string; header: string; context: string }>

const strEqual = (a: any, b: any) => `${a}` === `${b}`
/** 基于 apifox 定义的接口生成器逻辑 */
export class Generator {
    config!: IConfig
    details!: Array<IDetail>
    js!: boolean

    linter: Linter = new Linter()

    constructor() {
        this.linter.defineParser('@typescript-eslint/parser', parser as any)
        this.linter.defineRules(rules as any)
    }
    /**
     *
     * @param configure 配置
     * @param js 是否生成ts版本
     */
    @step({
        start: 'start generate',
        success: 'success',
        exit: true
    })
    @loading('generate...')
    async exec(configure: Configure): Promise<void> {
        const { config, details, treeList, schemas } = configure
        this.config = config
        this.details = details
        this.js = config.language === 'js'
        const { outDir, usage } = config
        const cache: TCache = []
        // -> 移除废弃接口
        this.details = removeDeprecatedApi(details)
        // -> 处理 schema $ref 引用
        transformSchemaRef(details, schemas)
        // ? 遍历并生成文件集合
        for (const { id, name } of usage) {
            const mapFile: string = config.mapFile.find((mf) => mf.id === id)?.file ?? 'undefined'
            // 从 treeNode 中, 拿到当前 folder 的子集
            const apis: Array<IDetail> = this.findApisByFolder(treeList, id)
            // 检查 apis 集合内, 是否存在完全相同的 path, 弹出报错信息
            this.checkDuplicatePath(apis)
            // 从 apis 集合内, 获取 baseUrl 属性 (注: 用来处理 Restful Api 范式出现的短路径重复问题)
            const repeatedUrlTail: boolean = this.checkApisHasSingleWordOrDuplicatedName(apis)
            /** 定义用于记录重复命名的 方法名, 参数接口名, 响应接口名 */
            const duplicate: { [key: string]: number } = {}
            // 转换为接口生成需要的信息
            const maps: Array<IApiOriginInfo> = []
            for (const api of apis) {
                const info = await this.transformApiInfo(api, duplicate, repeatedUrlTail)
                maps.push(info)
            }
            // 获取组路径
            const groupPath: string = this.findGroupPath(id, treeList)
            // 生成文件头
            // 文件名, 组名, 组路径
            const header: string = this.generateHeader(mapFile, name, groupPath, maps.length)
            // 生成文件内容
            const context: string = this.generateContext(name, maps)
            // 存入缓冲区
            cache.push({ moduleName: np.basename(mapFile), comment: name, mapFile, header, context })
        }
        // 输出文件
        for (const c of cache) {
            await this.outputFile(outDir, c.mapFile, c.header, c.context)
        }
        // 导出接口公共出口文件
        if (this.config.appendIndexFile) {
            this.outputFile(outDir, 'index.ts', this.generateIndexFile(cache), '')
        }
    }

    /** 从treeNode中, 获取folder下所有接口集合 */
    findApisByFolder(treeList: Array<ITreeNode>, id?: string | number): Array<IDetail> {
        let apis: Array<IDetail> = []
        // 查找 指定id下的children集合
        const findChildren = (tree: Array<ITreeNode>): Array<ITreeNode> | null => {
            for (const item of tree) {
                const [type, id1] = item.key.split('.')
                if (strEqual(id1, id)) {
                    return item.children
                } else if (type === 'apiDetailFolder') {
                    let res = findChildren(item.children)
                    if (res) {
                        return res
                    }
                }
            }
            return null
        }
        /** merge and flat */
        const merge = (tree: Array<ITreeNode>): Array<ITreeNode> => {
            let apis: Array<ITreeNode> = []
            for (const node of tree) {
                const { type } = node
                if (type === 'apiDetailFolder') {
                    let res = merge(node.children)
                    apis = apis.concat(res)
                } else if (type === 'apiDetail') {
                    apis.push(node)
                }
            }
            return apis
        }
        /** convert to Array<IDetail>
         *
         * @description 本地程序可以不考虑性能, 这么写看着舒服点~
         */
        const convert = (tree: Array<ITreeNode>): Array<IDetail> => {
            return tree.map((t) => {
                const [, id2] = t.key.split('.')
                const detail: IDetail = this.details.find((d) => d.id == id2) as IDetail
                return detail
            })
        }
        apis = convert(merge(findChildren(treeList) ?? [])).filter((api) => api)
        return apis
    }

    /** 查找组路径 */
    findGroupPath(id: string | number, list: Array<ITreeNode>): string {
        const find = (arr: Array<ITreeNode>): Array<ITreeNode> => {
            for (const n of arr) {
                if (n.children) {
                    let c = find(n.children)
                    if (c.length > 0) {
                        c.push(n)
                        return c
                    }
                }
                if (n.api?.id === id) {
                    return [n]
                }
            }
            return []
        }
        const log = find(list)
        log.pop()
        if (log.length === 0) return '*'
        return log.map((l) => l.name).join(' - ')
    }
    /** 判断 apis 列表中, 最后一段url是否包含单个单词, 或重复项, 如果不包含, 那么执行快速命名  */
    checkApisHasSingleWordOrDuplicatedName(apis: Array<IDetail>): boolean {
        let names: Set<string> = new Set()
        for (let api of apis) {
            // > 从后向前获取url路径段中, 非Restful Api path 参数部分
            let paragraph: string | null = urlLastParagraph(api.path)

            if (!paragraph) continue

            // ? 判断 set 中是否包含相同的url段落, 或这不存在多个单词 (没有大写单词或 - 分割符)
            if (names.has(paragraph) || !/[A-Z-]/.test(paragraph)) {
                return true
            }

            names.add(paragraph)
        }
        return false
    }

    /** 检查 apis 集合内, 是否存在完全相同的 path  */
    checkDuplicatePath(apis: Array<IDetail>): void {
        const grouped: Array<Array<IDetail>> = GroupBy(apis, (a, b) => a.path === b.path)
        const errMsgs: Array<string> = grouped.reduce((errMsgs: Array<string>, g) => {
            if (g.length > 1) {
                errMsgs.push(`> 存在相同接口定义: ${g[0].path}`)
            }
            return errMsgs
        }, [])
        if (this.config.strict && errMsgs.length > 0) {
            errMsgs.unshift('\n*************************************\n')
            errMsgs.push('\n\n\n')
            for (const msg of errMsgs) point.error(msg)
            process.exit(-1)
        }
    }

    /** 转换元数据为生成接口需要的信息
     *
     * @param {IDetail} detail 接口详细信息
     * @param {any} duplicate 命名重复次数
     * @param {boolean} repeatedUrlTail 尾端url是否重复 (包括仅包含1个单词的情况)
     */
    async transformApiInfo(
        detail: IDetail,
        duplicate: { [key: string]: number },
        repeatedUrlTail: boolean
    ): Promise<IApiOriginInfo> {
        const { id, method, path, name, createdAt, updatedAt } = detail
        const { globalRequestParams, globalResponseParams } = this.config.template
        // 1.1 生成baseName, 作为接口调用方法名
        const basename: string = this.generateBaseName(path, duplicate, repeatedUrlTail)
        // 1.2 生成参数接口命名
        const paramsInterfaceName: string = this.generateParamsInterfaceName(basename, duplicate)
        // 1.3 生成 Restful Api 路径参数接口命名 (具有唯一性, 不需要重复命名校验)
        const pathParamsInterfaceName: string = this.generateParamsInterfaceName(basename + 'Path', duplicate)
        // 1.4 生成响应接口命名 (具有唯一性, 不需要重复命名校验)
        const responseOriginInterfaceName: string = this.generateResponseInterfaceName(basename)

        // 2.1 清理全局参数
        transform(detail.requestBody.jsonSchema, globalRequestParams)
        // 2.2 添加父类继承
        appendParentInterface(detail.requestBody.jsonSchema, globalRequestParams.extend)

        // * jsonSchema to ts 生成器参数
        const opt: Partial<json2ts.Options> = {
            bannerComment: ``,
            unreachableDefinitions: true,
            declareExternallyReferenced: false,
            ignoreMinAndMaxItems: true,
            additionalProperties: false,
            unknownAny: false
        }
        // 3. 生成的参数接口内容
        let params: string | null = null

        if (Object.keys(detail.requestBody?.jsonSchema?.properties || {}).length > 0) {
            try {
                params = await json2ts.compile(detail.requestBody.jsonSchema, paramsInterfaceName, opt)
            } catch (error) {
                point.error('json2ts parser error: ' + paramsInterfaceName)
                params = `export interface ${paramsInterfaceName} { [key:string|number]: any }`
            }
        }

        // 4. 生成响应接口内容
        const responseNames = []
        const responses = []

        for (const resp of detail.responses) {
            transform(resp.jsonSchema, globalResponseParams)
            appendParentInterface(resp.jsonSchema, globalResponseParams.extend)
            const rin: string = formatNameSuffixByDuplicate(responseOriginInterfaceName, duplicate)
            let response!: string
            try {
                response = await json2ts.compile(resp.jsonSchema, rin, opt)
            } catch (error) {
                point.error('json2ts parser error: ' + rin)
                response = `export interface ${rin} { [key:string|number]: any }`
            }
            responseNames.push(rin)
            responses.push(response)
        }

        // 生成 Resutful Api 路径参数接口内容
        let pathParams: string | null = null
        if (detail?.parameters?.path?.length) {
            try {
                const scheam = transformPathParamsToJsonScheam(detail.parameters.path)
                pathParams = await json2ts.compile(scheam, pathParamsInterfaceName, opt)
            } catch (error) {
                // skip
                point.error('json2ts parser error: ' + pathParamsInterfaceName)
            }
        }

        return {
            id,
            method,
            path,
            name,
            basename,
            createdAt,
            updatedAt,
            hasParams: !!params,
            params: params,
            paramsName: paramsInterfaceName,
            responses: responses,
            responseNames,
            hasPathParams: !!pathParams,
            pathParamsName: pathParamsInterfaceName,
            pathParams
        }
    }

    /** 生成 basename, 用于接口方法名
     *
     * @param path 接口路径
     * @param duplicate 命名重复计数
     * @param repeatedUrlTail 尾端url是否重复 (包括仅包含1个单词的情况)
     * @returns
     */
    generateBaseName(path: string, duplicate: { [key: string]: number }, repeatedUrlTail: boolean): string {
        // 根据如下步骤, 生成接口方法名
        return [
            // 1. (预处理) 当尾段url不重复时, 生成更简短的命名
            (str: string) => (!repeatedUrlTail ? urlLastParagraph(str) ?? str : str),
            // 2. (预处理) 移除路径中的 Restful Api 参数
            (str: string) => str.replace(/[\$]{0,1}\{.+?\}/g, ''),
            // 3. (预处理) 裁剪超长路径名
            (str: string) => splitLongNameByPath(str, 3),
            // 4. (预处理) 裁剪接口命名词汇超过3个单词的命名
            (str: string) => splitLongCamelCaseNameByPath(str, 3),
            // 5. 删除路径中的起始斜杠(/)
            (str: string) => str.replace(/^[\/]+/g, ''),
            // 6. 将 Relative Path 的分隔符(/) 转化为下划线
            (str: string) => str.replace(/[\/]+/g, '_'),
            // 7. 转换为驼峰格式命名
            (str: string) => formatToHump(str),
            // 8. (后处理) 重复接口路径处理
            (str: string) => formatNameSuffixByDuplicate(str, duplicate),
            // 9. (后处理) 处理路径命名的Js关键词占用
            (str: string) => formatNameByDisabledKeyword(str)
        ].reduce((name: string, format) => format(name), path)
    }

    /** 生成参数接口命名
     *
     * @param basename 接口路径
     * @param duplicate
     * @returns
     */
    generateParamsInterfaceName(basename: string, duplicate: { [key: string]: number }): string {
        return formatNameSuffixByDuplicate(formatInterfaceName(basename, 'Params'), duplicate)
    }
    /** 生成响应接口命名
     *
     * @param basename 接口路径
     * @returns
     */
    generateResponseInterfaceName(basename: string): string {
        return formatInterfaceName(basename, 'Response')
    }

    /** 基于模板生成文件结构
     *
     * @param {string} file 文件名
     * @param {string} groupName 组名
     * @param {string} groupPath 组路径
     * @param {number} size 接口数量
     * @returns {string} 文件头
     */
    generateHeader(file: string, groupName: string, groupPath: string, size: number): string {
        const { header, importSyntax, requestUtil, utilPath, globalRequestParams, globalResponseParams } =
            this.config.template
        let template: string = ``
        let imp = importSyntax
            .replace('[requestUtil]', requestUtil)
            .replace('{ axios }', 'axios')
            .replace('[utilPath]', `"${requestUtil === 'axios' ? 'axios' : utilPath}"`)
            .replace(/["']{2}/g, '"')
        if (globalRequestParams.extend || globalResponseParams.extend) {
            let ext = [globalRequestParams.extend, globalResponseParams.extend].filter((e) => e).join(', ')
            let defImport: boolean = !/\{/.test(imp)
            if (defImport) {
                imp = imp.replace(requestUtil, `${requestUtil}, { ${ext} } `)
            } else {
                imp = imp.replace(requestUtil, `${requestUtil}, ${ext}`)
            }
        }
        // import 语句
        template += imp
        template += '\n'
        template += '\n'
        // header 注释
        template += header instanceof Array ? header.join('\n') : header
        template += '\n'
        template = template
            .replace(/\[group-path\]/g, groupPath)
            .replace(/\[group-name\]/g, groupName)
            .replace(/\[file-name\]/g, file)
            .replace(/\[apifox-url\]/g, `https://www.apifox.cn/web/project/${this.config.projectId}`)
            .replace(/\[api-size\]/g, size.toString())
        template += '\n\n'

        return template
    }

    /** 生成文件内容 */
    generateContext(name: string, maps: Array<IApiOriginInfo>): string {
        const { requestUtil } = this.config.template
        let context: string = ''
        for (const info of maps) {
            // 添加 params interface
            if (info.hasParams) {
                context += `/** params interface | ${info.name} */`
                context += '\n'
                context += info.params
                context += '\n'
            }

            // 添加 path params interface
            if (info.hasPathParams) {
                context += `/** path params interface | ${info.name} */`
                context += '\n'
                context += info.pathParams
                context += '\n'
            }

            // 添加 response interface
            context += `/** response interface | ${info.name} */`
            context += '\n'
            context += info.responses.join('\n')
            context += '\n'

            // 添加 request function
            const usageParams: string = info.hasParams ? ', params' : ''
            let apiPath: string
            if (info.hasPathParams) {
                apiPath = info.path.replace(/[\$]{0,1}\{(.+?)\}/g, '${params.$1}')
                apiPath = '`' + apiPath + '`'
            } else {
                apiPath = `'${info.path}'`
            }
            let requestFunction = `
                /** ${name} - ${info.name}
                 * 
                 * [params comment]
                 * @updateAt ${dayjs(info.updatedAt).format('YYYY-MM-DD HH:mm')}
                 */
                export const ${info.basename} = async ([params]) [response name] => {
                    return ${requestUtil}.${info.method.toLowerCase()}(${apiPath}${usageParams})
                }
            `
            // 替换 api path
            requestFunction = requestFunction.replace(/\[api url\]/, info.path)
            // 替换参数
            if (info.hasParams || info.hasPathParams) {
                const paramsNames: string = [
                    info.hasParams ? info.paramsName : null,
                    info.hasPathParams ? info.pathParamsName : null
                ]
                    .filter((pc) => pc)
                    .join('&')
                // 什么情况下参数可选? 1. 不存在path params 2. 不存在 params 3. 接口中存在可选变量
                const allowSkipParam: boolean = !info.hasPathParams && (!info.params || !/[\w]+:/gm.test(info.params))
                requestFunction = requestFunction.replace(/\[params comment\]/, `@param {${paramsNames}} params`)
                requestFunction = requestFunction.replace(
                    /\[params\]/,
                    `params${allowSkipParam ? '?' : ''}: ${paramsNames}`
                )
            } else {
                requestFunction = requestFunction.replace(/\[params comment\]/, '')
                requestFunction = requestFunction.replace(/\[params\]/, ``)
            }
            if (info.responseNames.length > 0) {
                requestFunction = requestFunction.replace(
                    /\[response name\]/,
                    ': Promise<' + info.responseNames.join(' | ') + '>'
                )
            } else {
                requestFunction = requestFunction.replace(/\[response name\]/, '')
            }
            context += requestFunction
            context += '\n\n'
        }
        context = context.replace(/\/\*\*\n.+?\* (.*)\n.*\*\//g, (_sub, $1) => {
            return `/** ${$1} */`
        })
        context = context.replace(/NoName/g, 'any // 注: 工具协议版本低, 未识别对象类型')
        return context
    }

    /** 生成公共的导出文件 */
    generateIndexFile(cache: TCache): string {
        const imports: Array<string> = cache.map((c) => {
            return `import * as ${formatToHump(c.moduleName)} from './${c.moduleName}'`
        })
        const modules: Array<string> = cache.map((c) => {
            return [`/** ${c.comment} */`, formatToHump(c.moduleName)].join('\n')
        })
        return `
        ${imports.join('\n')}
        
        /** apis 接口集合 */
        export const apis = {
            ${modules.join(',\n')}
        }
        `.trim()
    }

    /** 输出文件 */
    async outputFile(outDir: string, mapFile: string, header: string, context: string): Promise<void> {
        // 获取 prettier 格式化配置
        const prettierConfig = await getPrettierConfig()
        const format = (context: string) => {
            try {
                return prettier.format(context, { parser: 'typescript', ...prettierConfig } as prettier.Options)
            } catch (error) {
                return context
            }
        }
        // 检查输出目录是否存在, 不存在创建
        mkdirsSync(outDir)
        // 循环输出文件 (执行prettier格式化)
        let out: string = header + '\n' + context
        let outName: string = np.join(outDir, mapFile)
        outName = outName.replace(np.extname(outName), '')
        try {
            out = this.linter.verifyAndFix(out, {
                parser: '@typescript-eslint/parser',
                rules: {
                    'array-type': [2, { default: 'generic' }]
                }
            }).output
        } catch (error) {
            point.error('typescript parser failure. please check: ' + chalk.magenta(mapFile))
        }

        if (this.js) {
            const transformers = (typescript as any).getTransformers({
                target: typescript.ScriptTarget.ESNext,
                module: typescript.ModuleKind.ESNext,
                declaration: true
            })

            // transform to js
            let jsFile: string = typescript.transpile(out, {
                strict: false,
                target: ScriptTarget.ESNext,
                module: ModuleKind.ESNext,
                declaration: true
            })

            let dTsFile: string = typescript.transpileModule(out, {
                compilerOptions: {
                    target: typescript.ScriptTarget.ESNext,
                    module: typescript.ModuleKind.ESNext,
                    declaration: true
                },
                transformers: {
                    before: transformers.declarationTransformers
                }
            }).outputText
            fs.writeFileSync(outName + '.js', format(jsFile), { encoding: 'utf-8' })
            fs.writeFileSync(outName + '.d.ts', format(dTsFile), { encoding: 'utf-8' })
        } else {
            fs.writeFileSync(outName + '.ts', format(out), { encoding: 'utf-8' })
        }
    }
}
