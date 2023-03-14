/** 接口生成器配置 */
export interface IConfig {
    /** 数据源配置 */
    datasource: {
        /** 接口文档类型 */
        type: 'apifox' | 'apipost'
        account: {
            token: string
        }
    }
}
