import { request } from '@/utils/request'

/** * - 安全检查
 *
 * @apifox https://www.apifox.cn/web/project/1225216
 * @author apifox-generator
 */

/** params interface | 本月安全检查统计信息 */
export interface IQueryExamineTaskStatisticsParams {
    userId?: string
    appId?: string
    groupCode?: string
    projectId?: string
    operator?: {}
    content: {
        /** 考核类型code */
        examineType: string
        /** 检查标准id | 1: 大商业, 2: 室外街 */
        criterionId: string
        /** 开始时间点 */
        startTimeStr: string
        /** 结束时间点 */
        endTimeStr: string
        /** 项目集合 */
        projectIds: Array<string>
    }
}

/** response interface | 本月安全检查统计信息 */
export interface IQueryExamineTaskStatisticsResponse {
    /** 00000 */
    respCode: string
    /** success */
    respMsg: string
    content: {
        /** 周平均分 */
        averageScore: number
        /** 整改率 */
        reformRate: number
        /** 提报问题数 */
        submitNum: number
        /** 得分 */
        score: number
    }
}

/** 安全检查 - 本月安全检查统计信息
 *
 * @param {IQueryExamineTaskStatisticsParams} params
 * @updateAt 2022-08-04 12:37
 */
export const queryExamineTaskStatistics = async (
    params: IQueryExamineTaskStatisticsParams
): Promise<IQueryExamineTaskStatisticsResponse> => {
    return request.post('/examine/dashboard/queryExamineTaskStatistics', params)
}

/** params interface | 本月每周安全检查统计信息 */
export interface IQueryExamineTaskWeeklyStatisticsParams {
    userId?: string
    appId?: string
    groupCode?: string
    projectId?: string
    content: {
        examineType: string
        criterionId: string
        startTimeStr: string
        endTimeStr: string
        projectIds: Array<string>
    }
    operator?: {}
}

/** response interface | 本月每周安全检查统计信息 */
export interface IQueryExamineTaskWeeklyStatisticsResponse {
    respCode: string
    respMsg: string
    content: {
        /** 平均得分 */
        averageScore: number
        /** 周数据 */
        weekResults: Array<{
            /** 周名 */
            name: string
            /** 整改率 */
            reformRate: number
            /** 提报问题数 */
            submitNum: number
            /** 得分 */
            score: number
        }>
    }
}

/** 安全检查 - 本月每周安全检查统计信息
 *
 * @param {IQueryExamineTaskWeeklyStatisticsParams} params
 * @updateAt 2022-08-04 19:16
 */
export const queryExamineTaskWeeklyStatistics = async (
    params: IQueryExamineTaskWeeklyStatisticsParams
): Promise<IQueryExamineTaskWeeklyStatisticsResponse> => {
    return request.post('/examine-service/examine/dashboard/queryExamineTaskWeeklyStatistics', params)
}
