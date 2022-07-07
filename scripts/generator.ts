import * as fs from 'fs'
import * as np from 'path'
import * as json2ts from 'json-schema-to-typescript'

import prettier from 'prettier'
import dayjs from 'dayjs'
import { mkdirsSync } from 'fs-extra'
import { ESLint } from 'eslint' // 通过eslint + prettier + @typescript-eslint 格式化 输出文件

import { IConfig, IDetail, ITreeNode, IApiOriginInfo } from './intf'

import prettierConfig from './data/prettier.config'
import { transform, appendParentInterface } from './utils/schema'
import { formatInterfaceName, formatToHump } from './utils/format'

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

    async exec(config: IConfig, treeNode: Array<ITreeNode>, details: Array<IDetail>, mock?: boolean): Promise<void> {
        this.config = config
        this.details = details
        const { outDir, usage } = config
        const cache: Array<{ mapFile: string; header: string; context: string }> = []
        // ? 遍历并生成文件集合
        for (const { id, name, mapFile } of usage) {
            // 从 treeNode 中, 拿到当前 folder 的子集
            const apis: Array<{ node: ITreeNode; detail: IDetail }> = this.findApisByFolder(treeNode, id)
            // 转换为接口生成需要的信息
            const maps: Array<IApiOriginInfo> = []
            for (const { detail } of apis) {
                const info = await this.transformApiInfo(detail)
                maps.push(info)
            }
            // 生成文件头
            const header: string = this.generateHeader(name)
            // 生成文件内容
            const context: string = this.generateContext(name, maps)
            // 存入缓冲区
            cache.push({ mapFile, header, context })
        }
        // 输出文件
        for (const c of cache) await this.outputFile(outDir, c.mapFile, c.header, c.context)
    }

    /** 从treeNode中, 获取folder下所有接口集合 */
    findApisByFolder(treeNode: Array<ITreeNode>, id?: number): Array<{ node: ITreeNode; detail: IDetail }> {
        let apis: Array<{
            node: ITreeNode
            detail: IDetail
        }> = []
        for (const node of treeNode) {
            if (id && node.folder?.id !== id) continue
            for (const api of node.children) {
                if (api.type === 'apiDetailFolder') {
                    let children = this.findApisByFolder(api.children, id)
                    apis = apis.concat(children)
                } else {
                    const detail: IDetail = this.details.find((d) => d.id === api.api.id)
                    apis.push({ node: api, detail })
                }
            }
        }
        return apis
    }

    /** 转换元数据为生成接口需要的信息 */
    async transformApiInfo(detail: IDetail): Promise<IApiOriginInfo> {
        const { method, path, name, createdAt, updatedAt } = detail
        const { globalParamsKey, globalResponseKey, responseExtend } = this.config.requestTemplate
        const basename: string = formatToHump(np.basename(path))
        const paramsInterfaceName: string = formatInterfaceName(np.basename(path), 'Params')
        let responseInterfaceName: string = formatInterfaceName(np.basename(path), 'Response')

        transform(detail.requestBody.jsonSchema, globalParamsKey)
        let params: string | null = ''

        if (Object.keys(detail.requestBody?.jsonSchema?.properties || {}).length > 0) {
            params = await json2ts.compile(detail.requestBody.jsonSchema, paramsInterfaceName, {
                bannerComment: ``,
                unreachableDefinitions: true,
                declareExternallyReferenced: true,
                ignoreMinAndMaxItems: true
            })
        } else {
            params = null
        }

        const responseNames = []
        const responses = []

        for (const resp of detail.responses) {
            transform(resp.jsonSchema, globalResponseKey)
            appendParentInterface(resp.jsonSchema, responseExtend)
            const rin: string = responseInterfaceName + (responses.length > 0 ? responses.length : '')

            const response = await json2ts.compile(resp.jsonSchema, rin, {
                bannerComment: ``,
                unreachableDefinitions: true,
                declareExternallyReferenced: false,
                ignoreMinAndMaxItems: true
            })
            responseNames.push(rin)
            responses.push(response)
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
        }
    }

    /** 基于模板生成文件结构 */
    generateHeader(folderName: string) {
        const { importSyntax, headerComment } = this.config.requestTemplate
        let template: string = ``
        // import 语句
        template += importSyntax
        template += '\n'
        template += '\n'
        // header 注释
        template += headerComment instanceof Array ? headerComment.join('\n') : headerComment
        template += '\n'
        template = template
            .replace(/\[folder name\]/g, folderName)
            .replace(/\[apifox address\]/g, `https://www.apifox.cn/web/project/${this.config.projectId}`)
            .replace(/\[last update\]/, dayjs().format('YYYY-MM-DD HH:mm'))
        template += '\n\n'

        return template
    }

    /** 生成文件内容 */
    generateContext(name: string, maps: Array<IApiOriginInfo>): string {
        const { requestUtil } = this.config.requestTemplate
        let context: string = ''
        for (const info of maps) {
            // 添加 params interface
            context += `/** params interface | ${info.name} */`
            context += '\n'
            context += info.params
            context += '\n'
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
                requestFunction = requestFunction.replace(/\[params\]/, `params: ${info.paramsName}`)
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
        return context
    }

    /** 输出文件 */
    async outputFile(outDir: string, mapFile: string, header: string, context: string): Promise<void> {
        // 检查输出目录是否存在, 不存在创建
        mkdirsSync(outDir)
        // 循环输出文件 (执行prettier格式化)

        let out: string = header + '\n' + context
        out = (await this.eslint.lintText(out, {}))[0].output
        out = prettier.format(out, { parser: 'typescript', ...prettierConfig } as prettier.Options)
        let outName: string = np.join(outDir, mapFile)
        if (np.extname(outName) !== '.ts') outName += '.ts'
        fs.writeFileSync(outName, out, { encoding: 'utf-8' })
    }
}
