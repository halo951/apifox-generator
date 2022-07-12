import * as np from 'path'
import * as fs from 'fs'
import axios from 'axios'
import prettier from 'prettier'

import { IConfig } from './intf'
import { inputConfirm, inputMultiSelect, inputSelect, inputText } from './utils/input'

/** Apifox genetator 配置文件读取 & 生成 */
export class ConfigLoader {
    static configFilePath: Array<string> = ['apifox.rule.json'].map((r) => np.join(process.cwd(), r))

    static treeNodeListApi: string = 'https://api.apifox.cn/api/v1/api-tree-list?locale=zh-CN'
    static detailsApi: string = 'https://api.apifox.cn/api/v1/api-details?locale=zh-CN'
    static loginApi: string = 'https://api.apifox.cn/api/v1/login?locale=zh-CN'

    /** 配置 */
    config: IConfig
    /** 配置文件存储地址 */
    configPath: string

    async exec(): Promise<{ config: IConfig; treeNode: Array<any>; details: Array<any> }> {
        // 获取是否存在配置文件
        const config: IConfig = this.loadConfig()
        this.config = config
        // 配置输出文件目录
        await this.setOutDir()
        // 选择接口模板
        await this.setRequestTemplate()
        // 判断是否存在项目ID
        if (!this.config.projectId) {
            // 通过控制台输入配置
            const projectId: string = await inputText('配置 projectId (从apifox web端查看):')
            this.config.projectId = projectId
            this.updateConfig()
        }
        if (!this.config.Authorization) {
            const token: string = await this.login()
            this.config.Authorization = token
            this.updateConfig()
        }
        // 读取 treeNode, details
        const treeNode = await this.loadApiTreeNode()
        const details = await this.loadApiDetails()
        // 获取可用接口范围
        const folders = this.readApisDirectory(treeNode)
        // 与 config 中的 folders diff, 并更新引用
        const upgraded: boolean = this.upgradeConfigFolders(folders)
        // 如果不存在选中接口范围, 用户输入
        await this.selectUsageApiDoc(upgraded)

        // 配置是否添加 index.ts
        if (this.config.appendIndexFile === undefined) {
            const append: boolean = await inputConfirm('是否添加 index.ts 作为公共导出文件?')
            this.config.appendIndexFile = append
            this.updateConfig()
        }

        return {
            config: this.config,
            treeNode,
            details
        }
    }

    loadConfig(): IConfig {
        let config: IConfig
        for (const p of ConfigLoader.configFilePath) {
            try {
                if (!fs.existsSync(p)) continue
                const fi: string = fs.readFileSync(p, { encoding: 'utf-8' })
                config = JSON.parse(fi)
                this.configPath = p
                return config
            } catch (error) {
                // skip
            }
        }
        return {} as any
    }
    updateConfig(): void {
        let outFilePath: string = this.configPath ?? ConfigLoader.configFilePath[0]
        fs.writeFileSync(outFilePath, JSON.stringify(this.config, null, 4), { encoding: 'utf-8' })
    }

    async login(count: number = 0): Promise<string> {
        console.log('> 当前项目未登录, 请登录')
        const account: string = await inputText('输入账号:')
        const password: string = await inputText('输入密码:')
        let res
        try {
            res = await axios({
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
            })
        } catch (error) {
            const confirmed: boolean = await inputConfirm('登录失败, 是否打印错误信息:')
            if (confirmed) console.log(error)
        }
        if (res.status !== 200 || !res.data.success) {
            console.log('请求 apifox 失败')
            process.exit(-1) // stop thread
        }
        if (res.data?.data?.accessToken) {
            return res.data.data.accessToken
        } else {
            if (count > 5) {
                console.log('失败次数超过5次, 退出')
                process.exit(-1) // stop thread
            }
            console.log('> 登录失败, 请重试')
            return await this.login(count + 1)
        }
    }

    async loadApiTreeNode(): Promise<any> {
        const res = await axios({
            url: ConfigLoader.treeNodeListApi,
            headers: {
                Origin: 'https://www.apifox.cn',
                Authorization: this.config.Authorization,
                'X-Project-Id': this.config.projectId,
                'X-Client-Mode': 'web',
                'X-Client-Version': '2.1.17-alpha.3',
                'X-Device-Id': 'xW9HUp7S8CME0TSuW8t5yc5MEyeYw2uHq0R71neRktaketlfC9UQOGcwwOpyED43'
            }
        })
        if (res.status !== 200 || !res.data.success) {
            console.log('> 读取 tree node 时出错!')
            process.exit(-1) // stop thread
        }
        return res.data.data
    }
    async loadApiDetails(): Promise<any> {
        const res = await axios({
            url: ConfigLoader.detailsApi,
            headers: {
                Origin: 'https://www.apifox.cn',
                Authorization: this.config.Authorization,
                'X-Project-Id': this.config.projectId,
                'X-Client-Mode': 'web',
                'X-Client-Version': '2.1.17-alpha.3',
                'X-Device-Id': 'xW9HUp7S8CME0TSuW8t5yc5MEyeYw2uHq0R71neRktaketlfC9UQOGcwwOpyED43'
            }
        })
        if (res.status !== 200 || !res.data.success) {
            console.log('> 读取 details 时出错!')
            process.exit(-1) // stop thread
        }
        return res.data.data
    }

    /** 读取api文件夹 */
    readApisDirectory(nodeTree: Array<any>, folders: Array<{ id: number; name: string }> = []) {
        for (const item of nodeTree) {
            if (item.folder) {
                folders.push({ id: item.folder.id, name: item.name })
            }
            if (item.children) {
                this.readApisDirectory(item.children, folders)
            }
        }
        return folders
    }

    /** 更新接口引用 */
    upgradeConfigFolders(folders: Array<{ id: number; name: string }>): boolean {
        this.config.floders = this.config.floders || []
        const differenceSet: Array<{ id: number; name: string }> = folders.filter(
            (item) => !this.config.floders.some((ele) => ele.id === item.id)
        )
        if (differenceSet.length > 0) {
            this.config.floders = folders
        }
        this.updateConfig()
        return differenceSet.length > 0
    }
    /** 选择使用的接口文档集合 */
    async selectUsageApiDoc(upgraded: boolean): Promise<void> {
        this.config.usage = this.config.usage || []
        // 如果接口引用配置未修改, 且已配置接口规则, 则跳过这一步骤
        if (!upgraded && this.config.usage.length > 0) return
        const list: Array<{ id: number; name: string; mapFile: string }> = (await inputMultiSelect(
            '选择需要生成的接口',
            this.config.floders.map((f) => {
                return { title: f.name, value: f }
            })
        )) as Array<any>
        console.log('> 配置接口命名映射')
        for (const item of list) {
            const old = this.config.usage.find((u) => u.id === item.id)
            // ? 已配置过的, 跳过
            if (old) {
                item.mapFile = old.mapFile
            } else {
                const mapFile: string = await inputText(`配置接口映射文件名: (接口: ${item.name})`)
                item.mapFile = mapFile
            }
        }
        this.config.usage = list
        this.updateConfig()
    }

    async setOutDir(): Promise<void> {
        if (this.config.outDir) return
        const outDir: string = await inputText('配置输出文件路径')
        this.config.outDir = outDir
        this.updateConfig()
    }

    async setRequestTemplate() {
        if (this.config.requestTemplate) return
        console.log(
            `
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
                .join('\n')
        )

        const plan = await inputSelect('选择使用的 Request 工具模板', [
            { title: 'request util (建议)', value: 'request util' },
            { title: 'basic axios', value: 'basic util' }
        ])

        const headerComment: Array<string> = prettier
            .format(
                `
                /** 接口集合 - [folder name]
                 * 
                 * @apifox [apifox address]
                 * @author apifox-generator
                 * @date (最后一次更新日期) [last update]
                 */
        `
            )
            .split('\n')
        const globalParamsFilter: 'delete' | 'unrequire' = await inputSelect('选择参数字段全局变量过滤方式 (params)', [
            { title: 'delete', value: 'delete' },
            { title: 'unrequire', value: 'unrequire' }
        ])
        const globalResponseFilter: 'delete' | 'unrequire' = await inputSelect(
            '选择参数字段全局变量过滤方式 (response)',
            [
                { title: 'delete', value: 'delete' },
                { title: 'unrequire', value: 'unrequire' }
            ]
        )

        if (plan === 'request util') {
            this.config.requestTemplate = {
                name: 'request util',
                headerComment,
                importSyntax: `import { request, IResponse } from '@/utils/request'`,
                requestUtil: 'request',
                responseExtend: 'IResponse',
                globalParamsKey: [],
                globalResponseKey: [],
                globalParamsFilter,
                globalResponseFilter
            }
        } else {
            this.config.requestTemplate = {
                name: 'basic axios',
                headerComment,
                importSyntax: `import axios from 'axios'`,
                requestUtil: 'axios',
                responseExtend: null,
                globalParamsKey: [],
                globalResponseKey: [],
                globalParamsFilter,
                globalResponseFilter
            }
        }
        this.updateConfig()
    }
}
