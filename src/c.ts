import { request } from '@/utils/request'

/** * - 专项任务
 *
 * @apifox https://www.apifox.cn/web/project/1225216
 * @author apifox-generator
 */

/** params interface | 专项任务统计（app） */
export interface IQuerySpecialTaskDataParams {
    user_id: string
    project_ids: Array<string>
    startTimeStr: string
    endTimeStr: string
}

/** response interface | 专项任务统计（app） */
export interface IQuerySpecialTaskDataResponse {
    Item: {
        /** 按时完成 */
        ontime_count: number
        /** 逾期完成 */
        overdue_count: number
        /** 逾期未完成 */
        overdue_uf_count: number
        /** 任务数 */
        count: number
    }
    Result: string
}

/** 专项任务 - 专项任务统计（app）
 *
 * @param {IQuerySpecialTaskDataParams} params
 * @updateAt 2022-07-12 18:07
 */
export const querySpecialTaskData = async (
    params: IQuerySpecialTaskDataParams
): Promise<IQuerySpecialTaskDataResponse> => {
    return request.post('/task/appTaskManagementService/querySpecialTaskData', params)
}

/** params interface | 专项任务统计 （集团） */
export interface IQuerySpecialTaskDataParams1 {
    user_id: string
    project_ids: Array<string>
    startTimeStr: string
    endTimeStr: string
}

/** response interface | 专项任务统计 （集团） */
export interface IQuerySpecialTaskDataResponse1 {
    Item: {
        /** 按时完成 */
        ontime_count: number
        /** 逾期完成 */
        overdue_count: number
        /** 逾期未完成 */
        overdue_uf_count: number
        /** 任务数 */
        count: number
    }
    Result: string
}

/** 专项任务 - 专项任务统计 （集团）
 *
 * @param {IQuerySpecialTaskDataParams1} params
 * @updateAt 2022-08-02 17:50
 */
export const querySpecialTaskData1 = async (
    params: IQuerySpecialTaskDataParams1
): Promise<IQuerySpecialTaskDataResponse1> => {
    return request.post('/task/restTaskManagementService/querySpecialTaskData', params)
}
