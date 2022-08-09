import * as fs from 'fs'
import * as np from 'path'
import * as json2ts from 'json-schema-to-typescript'

import prettier from 'prettier'
import dayjs from 'dayjs'
import { mkdirsSync } from 'fs-extra'
import { ESLint } from 'eslint' // 通过eslint + prettier + @typescript-eslint 格式化 输出文件
import { GroupBy } from 'array-grouping'

import { IConfig } from './intf/IConfig'
import { IDetail } from './intf/IDetail'
import { ITreeNode } from './intf/ITreeData'
import { IApiOriginInfo } from './intf/IApiOriginInfo'

import { getPrettierConfig } from './utils/prettier.config'
import { transform, appendParentInterface } from './utils/schema'
import { formatInterfaceName, formatNameSuffixByDuplicate, formatToHump } from './utils/format'
import { point } from './utils/point'
import { loading, step } from './utils/decorators'
import { Configure } from './configure'

type TCache = Array<{ moduleName: string; comment: string; mapFile: string; header: string; context: string }>

const strEqual = (a: any, b: any) => `${a}` === `${b}`
/** 基于 apifox 定义的接口生成器逻辑 */
export class Generator {
    config!: IConfig
    details!: Array<IDetail>
    eslint: ESLint = new ESLint({
        fix: true,
        overrideConfig: {
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint', 'prettier'],
            rules: {
                'prettier/prettier': [2],
                '@typescript-eslint/array-type': [2, { default: 'generic' }]
            }
        }
    })

    @step({
        start: 'start generate',
        success: 'success',
        exit: true
    })
    @loading('generate...')
    async exec(configure: Configure): Promise<void> {
        const { config, details, treeList } = configure
        this.config = config
        this.details = details
        const { outDir, usage } = config
        const cache: TCache = []

        // ? 遍历并生成文件集合
        for (const { id, name } of usage) {
            const mapFile: string = config.mapFile.find((mf) => mf.id === id)?.file ?? 'undefined'
            fs.writeFileSync('./1.json', JSON.stringify(treeList, null, 4), { encoding: 'utf-8' })
            // 从 treeNode 中, 拿到当前 folder 的子集
            const apis: Array<IDetail> = this.findApisByFolder(treeList, id)
            // 检查 apis 集合内, 是否存在完全相同的 path, 弹出报错信息
            this.checkDuplicatePath(apis)
            /** 定义用于记录重复命名的 方法名, 参数接口名, 响应接口名 */
            const duplicate: { [key: string]: number } = {}
            // 转换为接口生成需要的信息
            const maps: Array<IApiOriginInfo> = []
            for (const api of apis) {
                const info = await this.transformApiInfo(api, duplicate)
                maps.push(info)
            }
            // 获取组路径
            const groupPath: string = this.findGroupPath(id, treeList)
            // 生成文件头
            // 文件名, 组名, 组路径
            const header: string = this.generateHeader(mapFile, name, groupPath)
            // 生成文件内容
            const context: string = this.generateContext(name, maps)
            // 存入缓冲区
            cache.push({ moduleName: np.basename(mapFile), comment: name, mapFile, header, context })
        }
        // 输出文件
        for (const c of cache) await this.outputFile(outDir, c.mapFile, c.header, c.context)
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
        apis = convert(merge(findChildren(treeList) ?? []))
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

    /** 检查 apis 集合内, 是否存在完全相同的 path  */
    checkDuplicatePath(apis: Array<IDetail>): void {
        const grouped: Array<Array<IDetail>> = GroupBy(apis, (a, b) => a.path === b.path)
        const errMsgs: Array<string> = grouped.reduce((errMsgs: Array<string>, g) => {
            if (g.length > 1) {
                errMsgs.push(`> 存在相同接口定义: ${g[0].path}`)
            }
            return errMsgs
        }, [])
        if (errMsgs.length > 0) {
            errMsgs.unshift('\n*************************************\n')
            errMsgs.push('\n\n\n')
            for (const msg of errMsgs) point.error(msg)
            process.exit(-1)
        }
    }

    /** 转换元数据为生成接口需要的信息 */
    async transformApiInfo(detail: IDetail, duplicate: { [key: string]: number }): Promise<IApiOriginInfo> {
        const { id, method, path, name, createdAt, updatedAt } = detail
        const { globalRequestParams, globalResponseParams } = this.config.template
        const basename: string = formatNameSuffixByDuplicate(formatToHump(np.basename(path)), duplicate)
        const paramsInterfaceName: string = formatNameSuffixByDuplicate(
            formatInterfaceName(np.basename(path), 'Params'),
            duplicate
        )
        const responseInterfaceName: string = formatInterfaceName(np.basename(path), 'Response')

        transform(detail.requestBody.jsonSchema, globalRequestParams)
        appendParentInterface(detail.requestBody.jsonSchema, globalRequestParams.extend)

        let params: string | null = ''

        const opt: Partial<json2ts.Options> = {
            bannerComment: ``,
            unreachableDefinitions: true,
            declareExternallyReferenced: false,
            ignoreMinAndMaxItems: true,
            additionalProperties: false,
            unknownAny: false,
            $refOptions: {}
        }

        if (Object.keys(detail.requestBody?.jsonSchema?.properties || {}).length > 0) {
            params = await json2ts.compile(detail.requestBody.jsonSchema, paramsInterfaceName, opt)
        } else {
            params = null
        }

        const responseNames = []
        const responses = []

        for (const resp of detail.responses) {
            transform(resp.jsonSchema, globalResponseParams)
            appendParentInterface(resp.jsonSchema, globalResponseParams.extend)
            const rin: string = formatNameSuffixByDuplicate(responseInterfaceName, duplicate)
            const response = await json2ts.compile(resp.jsonSchema, rin, opt)
            responseNames.push(rin)
            responses.push(response)
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
            responses: responses,
            paramsName: paramsInterfaceName,
            responseNames
        }
    }

    /** 基于模板生成文件结构
     *
     * @param {string} file 文件名
     * @param {string} groupName 组名
     * @param {string} groupPath 组路径
     * @returns {string} 文件头
     */
    generateHeader(file: string, groupName: string, groupPath: string): string {
        const { header, importSyntax, requestUtil, utilPath, globalRequestParams, globalResponseParams } =
            this.config.template
        let template: string = ``
        let imp = importSyntax
            .replace('[requestUtil]', requestUtil)
            .replace('[utilPath]', `"${utilPath}"`)
            .replace(/["']{2}/, '"')
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
        template += '\n\n'

        return template
    }

    /** 生成文件内容 */
    generateContext(name: string, maps: Array<IApiOriginInfo>): string {
        const { requestUtil } = this.config.template
        let context: string = '',
            allowSkipParam: boolean
        for (const info of maps) {
            // 添加 params interface
            if (info.hasParams) {
                context += `/** params interface | ${info.name} */`
                context += '\n'
                context += info.params
                context += '\n'
            }
            allowSkipParam = !info.params || !/[\w]+:/gm.test(info.params)
            // 添加 response interface
            context += `/** response interface | ${info.name} */`
            context += '\n'
            context += info.responses.join('\n')
            context += '\n'
            // 添加 request function
            const usageParams: string = info.hasParams ? ', params' : ''
            const apiPath: string = `'${info.path}'`
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
            if (info.hasParams) {
                requestFunction = requestFunction.replace(/\[params comment\]/, `@param {${info.paramsName}} params`)
                requestFunction = requestFunction.replace(
                    /\[params\]/,
                    `params${allowSkipParam ? '?' : ''}: ${info.paramsName}`
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
        context = context.replace(/\/\*\*\n.+?\* (.*)\n.*\*\//g, (sub, $1) => {
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
        // 检查输出目录是否存在, 不存在创建
        mkdirsSync(outDir)
        const prettierConfig = await getPrettierConfig()
        // 循环输出文件 (执行prettier格式化)
        let out: string = header + '\n' + context
        out = (await this.eslint.lintText(out, {}))[0].output ?? ''
        out = prettier.format(out, { parser: 'typescript', ...prettierConfig } as prettier.Options)
        let outName: string = np.join(outDir, mapFile)
        if (np.extname(outName) !== '.ts') outName += '.ts'
        fs.writeFileSync(outName, out, { encoding: 'utf-8' })
    }
}