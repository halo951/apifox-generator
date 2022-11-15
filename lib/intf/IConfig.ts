import { ISimpleTree, TSimpleTrees } from './ISimpleTree'

/** 生成模式 */
export enum EGenerateMode {
    /** 默认 | 提示是否更新配置 */
    default = 0,
    /** 快速生成 | 配置项完全时, 不重复提示配置 */
    quick = 1,
    /** 重新配置 */
    reconfig = 2
}

/** 全局参数接口参数配置 */
export interface IGlobalParams {
    keys: Array<string>
    /** 过滤方式
     *
     * @type "delete" 从导出参数中, 删除
     * @type "unrequire" 将必要属性修改为可选属性 (对于处理多种协议格式比较有效)
     */
    filter: 'delete' | 'unrequire'
    /** 是否集成公共响应父类 */
    extend?: string | null
}

/** 全局响应接口参数配置 */
export interface IGlobalResponse extends IGlobalParams {}

export interface IGenerateTemplate {
    /** 文件头说明 */
    header: string | Array<string>
    /** 使用的请求工具名称 (一般需要继承 axios)
     * @example
     * - import [requestUtil] from ...
     * - [requestUtil].post('', ...)
     */
    requestUtil: 'request' | 'axios' | string
    /** 导入语句格式 */
    importSyntax: 'import { [requestUtil] } from [utilPath]' | 'import [requestUtil] from [utilPath]'
    /** 请求工具地址 */
    utilPath: 'axios' | '@/utils/request' | string
    /** 全局请求参数变量 */
    globalRequestParams: IGlobalParams
    /** 全局响应变量 */
    globalResponseParams: IGlobalResponse
}

export interface IApiGroupNameMap {
    /** id */
    id: any
    /** 接口分组名 */
    name: any
    /** 映射的文件名 */
    file: string
}

export interface IConfig {
    /** 项目语言 */
    language: 'ts' | 'js'
    /** 输出目录 */
    outDir: string
    /** tk | usage token access apis */
    token: string
    /** 项目Id */
    projectId: string
    /** 是否添加 index.ts 作为公共出口文件 */
    appendIndexFile: boolean
    /* 可用接口集合 (用于校验本地配置规则与apifox文档对比是否一致, 避免出现新增接口文件夹, 本地不更新情况) */
    folders: TSimpleTrees
    /** 使用哪些接口 */
    usage: Array<ISimpleTree>
    /** 文件名映射 */
    mapFile: Array<IApiGroupNameMap>
    /** 生成模板 */
    template: IGenerateTemplate
}
