import type { IConfig } from './intf/IConfig'

import { apis } from './apis'
import { TTreeNodes } from './intf/ITreeData'
import { TDetils } from './intf/IDetail'
import {
    runLanguageForm,
    runAppendIndexFileForm,
    runLoginForm,
    runOutputDirForm,
    runTemplateForm,
    runProjectIdForm,
    runSetApiFileNameMapForm,
    runConfirmMergeDirectory
} from './utils/forms'
import { step } from './utils/decorators'
import { ISimpleTree, TSimpleTrees } from './intf/ISimpleTree'
import { TreeSelectPrompt } from './utils/tree-select-prompt'
import { TSchemas } from './intf/ISchema'

/** 处理配置变更, 用户配置项输入 */
export class Configure {
    /** 配置 */
    config!: IConfig

    /** 接口关系 | 树图结构 */
    treeList: TTreeNodes = []

    /** 接口信息 | 扁平列表结构 */
    details: TDetils = []

    /** schema集合 | 用于结构映射数据记录 */
    schemas: TSchemas = []

    @step({
        query: 'check and configure generate params',
        success: 'configure completed',
        failure: 'configuration item check not completed, task exit',
        exit: true
    })
    async run(config: IConfig, reset: boolean | string): Promise<IConfig> {
        this.config = config
        if (reset) {
            if (typeof reset === 'string') {
                for (const key of reset.split(',')) {
                    if (this.config[key as keyof IConfig]) {
                        delete this.config[key as keyof IConfig]
                    }
                }
            } else {
                this.config = {} as any
            }
        }
        // -> 设置项目语言
        this.config.language = await runLanguageForm(this.config.language)
        // -> 设置生成文件的导出目录
        this.config.outDir = await runOutputDirForm(this.config.outDir)
        // -> 设置是否生成公共导出文件 (index.ts)
        this.config.appendIndexFile = await runAppendIndexFileForm(this.config.appendIndexFile)
        // -> 设置生成模板
        this.config.template = await runTemplateForm(this.config.template)
        // -> token 检查 or 用户登录
        this.config.token = await runLoginForm(this.config.token)
        // -> 设置 项目ID & 检查项目Id 有效性
        this.config.projectId = await runProjectIdForm(this.config.token, this.config.projectId)
        // # 拉取项目数据
        await this.pullData()
        // -> 生成项目接口信息数
        const folders: TSimpleTrees = this.readApisDirectory(this.treeList)
        // ? diff 并判断是否需要更新节点
        const upgraded: boolean = this.checkApisIsUpgraded(folders, this.config.folders ?? [])
        // ? 如果发生更新, 则更新引用
        if (upgraded || (this.config.usage ?? []).length == 0) {
            // -> 更新引用
            this.config.folders = folders
            // -> 更新选择的接口
            this.config.usage = await this.multiSelectUsageApis(this.config.folders, this.config.usage ?? [])
        }
        // -> 检查 & 更新 命名映射
        await this.upgradeFileNameMap()
        // -> 配置 输出文件名
        return this.config as IConfig
    }

    /** 拉取接口数据 */
    @step({
        start: 'pull project data...',
        success: 'pull completed',
        exit: true
    })
    async pullData(): Promise<void> {
        const res = await apis.treeList(this.config.token, this.config.projectId)
        const res2 = await apis.details(this.config.token, this.config.projectId)
        const res3 = await apis.schema(this.config.token, this.config.projectId)
        const { data: treeList } = res.data
        const { data: details } = res2.data
        const { data: schemas } = res3.data
        this.treeList = treeList
        this.details = details
        this.schemas = schemas
    }

    /** 读取 api文件夹集合 */
    readApisDirectory(nodeTree: TTreeNodes, root: TSimpleTrees = []) {
        for (const { key, name, children } of nodeTree) {
            const [type, id] = key.split('.')
            let item: any = { id, name, children: [] }
            if (type === 'apiDetailFolder') {
                this.readApisDirectory(children, item.children)
                root.push(item)
            }
        }
        return root
    }

    /** 检查接口引用是否发生更新
     *
     * @description 先对tree进行扁平化操作, 然后 diff 出差集, 存在差集则发生了更新
     */
    checkApisIsUpgraded(n: TSimpleTrees, o: TSimpleTrees): boolean {
        const flat = (tree: Array<ISimpleTree>): Array<ISimpleTree> => {
            const out: Array<ISimpleTree> = []
            return tree.reduce((list, current) => {
                list.push(current)
                if (current.children) {
                    let children = flat(current.children)
                    return [...list, ...children]
                } else {
                    return list
                }
            }, out)
        }
        const a: Array<ISimpleTree> = flat(n)
        const b: Array<ISimpleTree> = flat(o)
        const differenceSet: Array<ISimpleTree> = a.filter((i1) => {
            return !b.some((i2) => i2.id === i1.id)
        })
        return differenceSet.length > 0
    }
    /** 设置需要生成的接口
     *
     * @description
     *  - 如果数据源发生更改, 触发待生成结构项更新
     */
    async multiSelectUsageApis(folders: TSimpleTrees, usage: TSimpleTrees) {
        type IList = Array<{ id: string; name: string }>
        const selected: IList = await new TreeSelectPrompt({
            message: '选择需要生成的接口集合',
            choices: folders,
            initial: usage,
            header: [
                '********************************************************************************',
                '生成规则:',
                ' * 以下规则主要应对apifox文件夹出现多层嵌套的情况',
                '',
                ' - 如果一个文件夹下的所有子文件夹被选中, 则接口合并到这个文件夹内',
                ' - 存在一点局限性, 如果一个文件夹下同时存在接口和文件夹时, 将被当作文件夹处理',
                '********************************************************************************'
            ].join('\n')
        }).run()

        const find = (list: TSimpleTrees, current: { id: string }): ISimpleTree | null => {
            for (const item of list) {
                if (item.id === current.id) {
                    return item
                } else if (item.children) {
                    const res = find(item.children, current)
                    if (res) return res
                }
            }
            return null
        }
        let out: IList = []
        const transform = async (list: any, parent: Array<string>) => {
            for (const item of list) {
                const origin = find(folders, item)
                if (origin?.children && origin.children.length > 0) {
                    // 提示用户是否合并此目录
                    const merge = await runConfirmMergeDirectory([...parent, origin.name].join('/'))
                    if (merge) {
                        out.push({ id: item.id, name: item.name })
                    } else {
                        // deep check
                        await transform(origin.children, [...parent, origin.name])
                    }
                } else {
                    out.push({ id: item.id, name: item.name })
                }
            }
        }
        await transform(selected, [])
        return out
    }

    /** 设置接口别名 (接口文件名) */
    @step({ query: 'check api name mapping is filled', success: 'adopt', failure: 'unknow excaption', exit: true })
    async upgradeFileNameMap(): Promise<void> {
        if (!this.config.mapFile) this.config.mapFile = []
        const treeToFlatArray = (nodeList: TSimpleTrees): TSimpleTrees => {
            let value: TSimpleTrees = []
            for (const item of nodeList) {
                value.push(item)
                // deep
                if (item.children) {
                    value = value.concat(treeToFlatArray(item.children))
                }
            }
            return value
        }

        // 将多维数组转化为1维数组
        const form: TSimpleTrees = treeToFlatArray(this.config.usage).filter((u) => {
            return !this.config.mapFile.some((mf) => mf.id === u.id && mf.file && mf.file?.trim() !== '')
        })
        // 用户输入新增的文件名
        const list = await runSetApiFileNameMapForm(form)

        // 更新命名映射
        for (const map of list) {
            let index: number = this.config.mapFile.findIndex((mf) => mf.id === map.id)
            if (index === -1) {
                this.config.mapFile.push(map)
            } else {
                this.config.mapFile[index] = map
            }
        }
    }
}
