import { request } from '@/utils/request'

/** * - 工单
 *
 * @apifox https://www.apifox.cn/web/project/1225216
 * @author apifox-generator
 */

/** params interface | 本月工单统计 */
export interface IQueryCurrentMonthWorkOrderDatasParams {
    /** 用户ID */
    user_id: string
    /** 项目Id集合 */
    project_ids: Array<string>
    /** 0-工程物业中心、1-工程条线（部）、2-物业条线（部）、3-安品条线（部） */
    departType: number
    /** 选中的月,格式为201811格式.必须.默认当前月 */
    selectedMonth: string
    /** 用户密码MD5 */
    pd: string
}

/** response interface | 本月工单统计 */
export interface IQueryCurrentMonthWorkOrderDatasResponse {
    Item: {
        /** 巡检 */
        inspectOrderNum: number
        /** 逾期未完成 */
        overdueUNum: number
        /** 工单总数 */
        orderNum: number
        /** 按时完成 */
        timeFNum: number
        /** 维保 */
        maintainOrderNum: number
        /** 逾期完成 */
        overdueFNum: number
        /** 及时完成率 */
        timelyCompleteRate: number
        /** 报修 */
        repairOrderNum: number
        /** 三关一闭 */
        runOrderNum: number
    }
    Result: string
    ResultCode: number
}

/** 工单 - 本月工单统计
 *
 * @param {IQueryCurrentMonthWorkOrderDatasParams} params
 * @updateAt 2022-08-02 17:48
 */
export const queryCurrentMonthWorkOrderDatas = async (
    params: IQueryCurrentMonthWorkOrderDatasParams
): Promise<IQueryCurrentMonthWorkOrderDatasResponse> => {
    return request.post('/workorder/appHomePageService/queryCurrentMonthWorkOrderDatas', params)
}

/** params interface | 三关一闭（时间） */
export interface IQueryRunDataParams {
    user_id: string
    project_ids: Array<string>
    departType: number
    selectedMonth: string
    pd: string
}

/** response interface | 三关一闭（时间） */
export interface IQueryRunDataResponse {
    Item: {
        pointTimeFNumRates: Array<number>
        pointUNums: Array<number>
        pointOverdueFNums: Array<number>
        pointTimeFNums: Array<number>
        pointNum: number
        pointTimeFNumRate: number
    }
    Count: number
    Result: string
}

/** 工单 - 三关一闭（时间）
 *
 * @param {IQueryRunDataParams} params
 * @updateAt 2022-07-13 15:26
 */
export const queryRunData = async (params: IQueryRunDataParams): Promise<IQueryRunDataResponse> => {
    return request.post('/workorder/appHomePageService/queryRunData', params)
}

/** params interface | 报修统计（时间） */
export interface IQueryRepairDataParams {
    /** 当前用户ID */
    user_id: string
    /** 项目ID集合 */
    project_ids: Array<string>
    /** 0-工程物业中心、1-工程条线（部）、2-物业条线（部）、3-安品条线（部） */
    departType: 0 | 1 | 2 | 3
    /** 选中的月,格式为201811格式.必须.默认当前月 */
    selectedMonth: string
    /**  | 用户密码MD5值 */
    pd: string
}

/** response interface | 报修统计（时间） */
export interface IQueryRepairDataResponse {
    Content: Array<{
        eventTimelyCompleteRate: number
        total: number
        type: string
    }>
    Count: number
    Result: string
}

/** 工单 - 报修统计（时间）
 *
 * @param {IQueryRepairDataParams} params
 * @updateAt 2022-08-02 17:49
 */
export const queryRepairData = async (params: IQueryRepairDataParams): Promise<IQueryRepairDataResponse> => {
    return request.post('/workorder/appHomePageService/queryRepairData', params)
}

/** params interface | 维保统计（时间） */
export interface IQueryMaintainDataParams {
    user_id: string
    project_ids: Array<string>
    departType: number
    selectedMonth: string
    pd: string
}

/** response interface | 维保统计（时间） */
export interface IQueryMaintainDataResponse {
    Item: {
        pointTimeFNumRates: Array<number>
        pointUNums: Array<number>
        pointOverdueFNums: Array<number>
        pointTimeFNums: Array<number>
        pointNum: number
        pointTimeFNumRate: number
    }
    Count: number
    Result: string
}

/** 工单 - 维保统计（时间）
 *
 * @param {IQueryMaintainDataParams} params
 * @updateAt 2022-08-03 16:46
 */
export const queryMaintainData = async (params: IQueryMaintainDataParams): Promise<IQueryMaintainDataResponse> => {
    return request.post('/workorder/appHomePageService/queryMaintainData', params)
}

/** params interface | 三关一闭 （人员） */
export interface IQueryPersonRunDataParams {
    /** 当前用户ID */
    user_id: string
    /** 项目ID集合 */
    project_ids: Array<string>
    /** 0-工程物业中心、1-工程条线（部）、2-物业条线（部）、3-安品条线（部） */
    departType: 0 | 1 | 2 | 3
    /** 选中的月,格式为201811格式.必须.默认当前月 */
    selectedMonth: string
    /**  | 用户密码MD5值 */
    pd: string
    /** 项目Id */
    project_id: string
}

/** response interface | 三关一闭 （人员） */
export interface IQueryPersonRunDataResponse {
    Content: Array<{
        name: string
        pointTimeFNum: number
        pointOverdueFNum: number
        pointUNum: number
        pointTimeFNumRate: number
    }>
    Count: number
    Result: string
}

/** 工单 - 三关一闭 （人员）
 *
 * @param {IQueryPersonRunDataParams} params
 * @updateAt 2022-07-27 15:27
 */
export const queryPersonRunData = async (params: IQueryPersonRunDataParams): Promise<IQueryPersonRunDataResponse> => {
    return request.post('/workorder/appHomePageService/queryPersonRunData', params)
}

/** params interface | 维保统计（人员） */
export interface IQueryPersonMaintainDataParams {
    /** 当前用户ID */
    user_id: string
    /** 项目ID集合 */
    project_ids: Array<string>
    /** 0-工程物业中心、1-工程条线（部）、2-物业条线（部）、3-安品条线（部） */
    departType: 0 | 1 | 2 | 3
    /** 选中的月,格式为201811格式.必须.默认当前月 */
    selectedMonth: string
    /**  | 用户密码MD5值 */
    pd: string
    project_id: string
}

/** response interface | 维保统计（人员） */
export interface IQueryPersonMaintainDataResponse {
    Content: Array<{
        name: string
        pointTimeFNum: number
        pointOverdueFNum: number
        pointUNum: number
        pointTimeFNumRate: number
    }>
    Count: number
    Result: string
}

/** 工单 - 维保统计（人员）
 *
 * @param {IQueryPersonMaintainDataParams} params
 * @updateAt 2022-07-27 15:25
 */
export const queryPersonMaintainData = async (
    params: IQueryPersonMaintainDataParams
): Promise<IQueryPersonMaintainDataResponse> => {
    return request.post('/workorder/appHomePageService/queryPersonMaintainData', params)
}

/** params interface | 报修统计（人员） */
export interface IQueryPersonRepairDataParams {
    user_id: string
    project_id: string
    departType: number
}

/** response interface | 报修统计（人员） */
export interface IQueryPersonRepairDataResponse {
    Content: Array<{
        eventTimelyCompleteRate: number
        total: number
        type: string
    }>
    Count: number
    Result: string
}

/** 工单 - 报修统计（人员）
 *
 * @param {IQueryPersonRepairDataParams} params
 * @updateAt 2022-07-12 16:32
 */
export const queryPersonRepairData = async (
    params: IQueryPersonRepairDataParams
): Promise<IQueryPersonRepairDataResponse> => {
    return request.post('/workorder/appHomePageService/queryPersonRepairData', params)
}

/** params interface | 报修统计（集团） */
export interface IQueryRepairDataParams1 {
    /** 当前用户ID */
    user_id: string
    /** 项目ID集合 */
    project_ids: Array<string>
    /** 0-工程物业中心、1-工程条线（部）、2-物业条线（部）、3-安品条线（部） */
    departType: 0 | 1 | 2 | 3
    /** 选中的月,格式为201811格式.必须.默认当前月 */
    selectedMonth: string
    /**  | 用户密码MD5值 */
    pd: string
}

/** response interface | 报修统计（集团） */
export interface IQueryRepairDataResponse1 {
    Content: Array<{
        eventTimelyCompleteRate: number
        total: number
        type: string
    }>
    Count: number
    Result: string
}

/** 工单 - 报修统计（集团）
 *
 * @param {IQueryRepairDataParams1} params
 * @updateAt 2022-08-03 16:47
 */
export const queryRepairData1 = async (params: IQueryRepairDataParams1): Promise<IQueryRepairDataResponse1> => {
    return request.post('/workorder/groupHomePageService/queryRepairData', params)
}

/** params interface | 三关一闭（集团） */
export interface IQueryRunDataParams1 {
    user_id: string
    startTimeStr: string
    endTimeStr: string
    selProjectId: string
}

/** response interface | 三关一闭（集团） */
export interface IQueryRunDataResponse1 {
    Result: string
    ResultCode: string
    Item: {
        finishRate: Array<string>
        unfinishedNum: Array<string>
        completeNum: Array<string>
        posNum: string
        scaleRate: string
        showTimeFields: Array<string>
    }
}

/** 工单 - 三关一闭（集团）
 *
 * @param {IQueryRunDataParams1} params
 * @updateAt 2022-07-26 10:45
 */
export const queryRunData1 = async (params: IQueryRunDataParams1): Promise<IQueryRunDataResponse1> => {
    return request.post('/workorder/groupHomePageService/queryRunData', params)
}
