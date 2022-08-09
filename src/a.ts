import { request } from '@/utils/request'

/** * - 工单(旧)
 *
 * @apifox https://www.apifox.cn/web/project/1225216
 * @author apifox-generator
 */

/** params interface | 项目介绍排名：项目介绍 */
export interface IGetProjectIntroductionsParams {
    /** 当前用户Id */
    user_id: string
    /** 用户密码MD5值 */
    pd: string
    /** 项目ID集合 */
    project_ids: Array<string>
}

/** response interface | 项目介绍排名：项目介绍 */
export interface IGetProjectIntroductionsResponse {
    Result: string
    Content: Array<{
        /** 项目Id */
        project_id?: string
        /** 项目名称 */
        project_name?: string
        /** 项目图片Key */
        pictures?: Array<string>
        /** 项目介绍 */
        introduction?: string
    }>
}

/** 工单(旧) - 项目介绍排名：项目介绍
 *
 * @param {IGetProjectIntroductionsParams} params
 * @updateAt 2022-07-13 15:02
 */
export const getProjectIntroductions = async (
    params: IGetProjectIntroductionsParams
): Promise<IGetProjectIntroductionsResponse> => {
    return request.post('/workorder/appHomePageService/getProjectIntroductions', params)
}

/** params interface | 项目介绍排名：项目排名 */
export interface IGetProjectRankingDataParams {
    /** 当前用户ID */
    user_id: string
    /** 用户密码MD5值 */
    pd: string
    /** 项目ID集合 */
    project_ids: Array<string>
    /** 选中的月,格式为201811格式.必须.默认当前月 */
    selectedMonth: string
    /** 项目名称筛选 */
    keyword: string
    /** 为空或0-全部,1-营运期,2-筹备期.开业时间之后的属于营运期,开业时间之前的属于筹备期 */
    businessFlag: number
    /** 空/0 - 全部,1-考核,2-不考核.开业时间+2个月之后的属于考核,开业时间+2个月之前的属于不考核 */
    checkFlag: number
}

/** response interface | 项目介绍排名：项目排名 */
export interface IGetProjectRankingDataResponse {
    Content: Array<{
        /** 排名 */
        rank: number
        /** 项目得分 */
        score: number
        /** 项目id */
        project_id: string
        /** 项目名称 */
        project_name: string
        /** 0-没有开业时间,1-营运期,2-筹备期.开业时间之后的属于营运期,开业时间之前的属于筹备期 */
        businessFlag: number
        /** 0-没有开业时间,1-考核,2-不考核.开业时间+2个月之后的属于考核,开业时间+2个月之前的属于不考核 */
        checkFlag: number
        /** 空字符串或者为null-没有开业时间,1-考核,2-不考核.开业时间+2个月之后的属于考核,开业时间+2个月之前的属于不考核 */
        checkFlagName: string
        /** 空字符串或者为null-没有开业时间,1-营运期,2-筹备期.开业时间之后的属于营运期,开业时间之前的属于筹备期 */
        businessFlagName: string
    }>
    Result: string
}

/** 工单(旧) - 项目介绍排名：项目排名
 *
 * @param {IGetProjectRankingDataParams} params
 * @updateAt 2022-07-13 15:02
 */
export const getProjectRankingData = async (
    params: IGetProjectRankingDataParams
): Promise<IGetProjectRankingDataResponse> => {
    return request.post('/workorder/appHomePageService/getProjectRankingData', params)
}

/** params interface | 本月工单 */
export interface IQueryCurrentMonthWorkOrderDatasParams {
    /**  | 用户Id */
    user_id: string
    /** 用户密码Md5值 */
    pd: string
    /** 项目Id集合 */
    project_ids: Array<string>
    /** 0-工程物业安品、1-工程条线（部）、2-物业条线（部）、3-安品条线（部） */
    departType: number
    /** 选中的月,格式为201811格式.必须.默认当前月 */
    selectedMonth: string
}

/** response interface | 本月工单 */
export interface IQueryCurrentMonthWorkOrderDatasResponse {
    Result: string
    Item: {
        /** 本月工单总数 */
        orderNum: number
        /** 按时已完成工单数 */
        timeFNum: number
        /** 逾期已完成工单数 */
        overdueFNum: number
        /** 逾期未完成工单数 */
        overdueUNum: number
        /** 及时完成率 */
        timelyCompleteRate: number
        /** 维修数量 */
        repairOrderNum: number
        /** 维保数量 */
        maintainOrderNum: number
        /** 巡检数量 */
        inspectOrderNum: number
        /** 运行数量 */
        runOrderNum: number
    }
}

/** 工单(旧) - 本月工单
 *
 * @param {IQueryCurrentMonthWorkOrderDatasParams} params
 * @updateAt 2022-07-13 15:02
 */
export const queryCurrentMonthWorkOrderDatas = async (
    params: IQueryCurrentMonthWorkOrderDatasParams
): Promise<IQueryCurrentMonthWorkOrderDatasResponse> => {
    return request.post('/workorder/appHomePageService/queryCurrentMonthWorkOrderDatas', params)
}

/** params interface | 本月巡检数据统计-时间 */
export interface IQueryInspectDataParams {
    /** 用户Id */
    user_id: string
    /** 密码MD5哈希 */
    pd: string
    /** 项目id集合 */
    project_ids: Array<string>
    /**  | 选中的月,格式为201811格式.必须.默认当前月 */
    selectedMonth: string
    /** 0-工程物业中心、1-工程条线（部）、2-物业条线（部）、3-安品条线（部） */
    departType: 0 | 1 | 2 | 3
}

/** response interface | 本月巡检数据统计-时间 */
export interface IQueryInspectDataResponse {
    Result: string
    Item: {
        /** 各周的及时完成率，默认0 */
        pointTimeFNumRates: Array<number>
        /** 各周的未完成点位，默认0 */
        pointUNums: Array<number>
        /** 各周的逾期已完成点位数,默认0 */
        pointOverdueFNums: Array<number>
        /** 各周的按时已完成点位,，默认0 */
        pointTimeFNums: Array<number>
        /** 点位总数 */
        pointNum: number
        /** 按时已完成点位数量占比,点位及时完成率 */
        pointTimeFNumRate: number
    }
}

/** 工单(旧) - 本月巡检数据统计-时间
 *
 * @param {IQueryInspectDataParams} params
 * @updateAt 2022-07-13 15:02
 */
export const queryInspectData = async (params: IQueryInspectDataParams): Promise<IQueryInspectDataResponse> => {
    return request.post('/workorder/appHomePageService/queryInspectData', params)
}

/** params interface | 本月维保数据统计-时间 */
export interface IQueryMaintainDataParams {
    /** 用户Id */
    user_id: string
    /** 密码MD5哈希 */
    pd: string
    /** 项目id集合 */
    project_ids: Array<string>
    /**  | 选中的月,格式为201811格式.必须.默认当前月 */
    selectedMonth: string
    /** 0-工程物业中心、1-工程条线（部）、2-物业条线（部）、3-安品条线（部） */
    departType: number
}

/** response interface | 本月维保数据统计-时间 */
export interface IQueryMaintainDataResponse {
    Result: string
    Item: {
        /** 各周的及时完成率，默认0 */
        pointTimeFNumRates: Array<number>
        /** 各周的未完成点位，默认0 */
        pointUNums: Array<number>
        /** 各周的逾期已完成点位数,默认0 */
        pointOverdueFNums: Array<number>
        /** 各周的按时已完成点位,，默认0 */
        pointTimeFNums: Array<number>
        /** 点位总数 */
        pointNum: number
        /** 按时已完成点位数量占比,点位及时完成率 */
        pointTimeFNumRate: number
    }
}

/** 工单(旧) - 本月维保数据统计-时间
 *
 * @param {IQueryMaintainDataParams} params
 * @updateAt 2022-07-13 15:02
 */
export const queryMaintainData = async (params: IQueryMaintainDataParams): Promise<IQueryMaintainDataResponse> => {
    return request.post('/workorder/appHomePageService/queryMaintainData', params)
}

/** params interface | 本月维修数据统计-时间 */
export interface IQueryRepairDataParams {
    /** 用户Id */
    user_id: string
    /** 密码MD5哈希 */
    pd: string
    /** 项目id集合 */
    project_ids: Array<string>
    /**  | 选中的月,格式为201811格式.必须.默认当前月 */
    selectedMonth: string
    /** 0-工程物业中心、1-工程条线（部）、2-物业条线（部）、3-安品条线（部） */
    departType: number
}

/** response interface | 本月维修数据统计-时间 */
export interface IQueryRepairDataResponse {
    Result: string
    Content: Array<{
        /** 类别 */
        type: string
        /** 工单总数 */
        total: number
        /** 及时完成率 */
        eventTimelyCompleteRate: number
    }>
}

/** 工单(旧) - 本月维修数据统计-时间
 *
 * @param {IQueryRepairDataParams} params
 * @updateAt 2022-07-13 15:02
 */
export const queryRepairData = async (params: IQueryRepairDataParams): Promise<IQueryRepairDataResponse> => {
    return request.post('/workorder/appHomePageService/queryRepairData', params)
}

/** params interface | 本月运行数据统计-时间 */
export interface IQueryRunDataParams {
    /** 用户Id */
    user_id: string
    /** 密码MD5哈希 */
    pd: string
    /** 项目id集合 */
    project_ids: Array<string>
    /**  | 选中的月,格式为201811格式.必须.默认当前月 */
    selectedMonth: string
    /** 0-工程物业安品、1-工程条线（部）、2-物业条线（部） */
    departType: number
}

/** response interface | 本月运行数据统计-时间 */
export interface IQueryRunDataResponse {
    Result: string
    Content: Array<{
        /** 类别 */
        type: string
        /** 工单总数 */
        total: number
        /** 及时完成率 */
        eventTimelyCompleteRate: number
    }>
}

/** 工单(旧) - 本月运行数据统计-时间
 *
 * @param {IQueryRunDataParams} params
 * @updateAt 2022-07-13 15:02
 */
export const queryRunData = async (params: IQueryRunDataParams): Promise<IQueryRunDataResponse> => {
    return request.post('/workorder/appHomePageService/queryRunData', params)
}

/** params interface | 本月巡检数据统计-人员 */
export interface IQueryPersonInspectDataParams {
    /** 当前用户ID */
    user_id: string
    /** 用户密码MD5值 */
    pd: string
    /** 项目ID */
    project_id: string
    /**  0-工程物业中心、1-工程条线（部）、2-物业条线（部）、3-安品条线（部） */
    departType: 0 | 1 | 2 | 3
    /** 选中的月,格式为201811格式.必须.默认当前月 */
    selectedMonth: string
}

/** response interface | 本月巡检数据统计-人员 */
export interface IQueryPersonInspectDataResponse {
    Result: string
    Content: Array<{
        /** 人员名称 */
        name: string
        /** 按时已完成点位 */
        pointTimeFNum: number
        /** 逾期已完成点位 */
        pointOverdueFNum: number
        /** 未完成点位 */
        pointUNum: number
        /** 及时完成率 */
        pointTimeFNumRate: number
    }>
}

/** 工单(旧) - 本月巡检数据统计-人员
 *
 * @param {IQueryPersonInspectDataParams} params
 * @updateAt 2022-07-13 15:02
 */
export const queryPersonInspectData = async (
    params: IQueryPersonInspectDataParams
): Promise<IQueryPersonInspectDataResponse> => {
    return request.post('/workorder/appHomePageService/queryPersonInspectData', params)
}

/** params interface | 本月维保数据统计-人员 */
export interface IQueryPersonMaintainDataParams {
    /** 当前用户ID */
    user_id: string
    /** 用户密码MD5值 */
    pd: string
    /** 项目ID */
    project_id: string
    /** 选中的月,格式为201811格式.必须.默认当前月 */
    selectedMonth: string
    /** 1-工程条线（部） */
    departType: 1
}

/** response interface | 本月维保数据统计-人员 */
export interface IQueryPersonMaintainDataResponse {
    Result: string
    Content: Array<{
        /** 人员名称 */
        name: string
        /** 按时已完成点位 */
        pointTimeFNum: number
        /** 逾期已完成点位 */
        pointOverdueFNum: number
        /** 未完成点位 */
        pointUNum: number
        /** 及时完成率 */
        pointTimeFNumRate: number
    }>
}

/** 工单(旧) - 本月维保数据统计-人员
 *
 * @param {IQueryPersonMaintainDataParams} params
 * @updateAt 2022-07-13 15:02
 */
export const queryPersonMaintainData = async (
    params: IQueryPersonMaintainDataParams
): Promise<IQueryPersonMaintainDataResponse> => {
    return request.post('/workorder/appHomePageService/queryPersonMaintainData', params)
}

/** params interface | 本月运行数据统计-人员 */
export interface IQueryPersonRunDataParams {
    /** 当前用户ID */
    user_id: string
    /** 用户密码MD5值 */
    pd: string
    /** 项目ID */
    project_id: string
    /** 1-工程条线（部）、2-物业条线（部） */
    departType: 1 | 2
    /** 选中的月,格式为201811格式.必须.默认当前月 */
    selectedMonth: string
}

/** response interface | 本月运行数据统计-人员 */
export interface IQueryPersonRunDataResponse {
    Result: string
    Content: Array<{
        /** 人员名称 */
        name: string
        /** 已完成工单 */
        orderFNum: number
        /** 未完成工单 */
        orderUNum: number
        /** 及时完成率 */
        timelyCompleteRate: number
    }>
}

/** 工单(旧) - 本月运行数据统计-人员
 *
 * @param {IQueryPersonRunDataParams} params
 * @updateAt 2022-07-13 15:02
 */
export const queryPersonRunData = async (params: IQueryPersonRunDataParams): Promise<IQueryPersonRunDataResponse> => {
    return request.post('/workorder/appHomePageService/queryPersonRunData', params)
}

/** params interface | 本月巡检数据统计-项目 */
export interface IQueryProjectInspectDataParams {
    /** 当前用户ID */
    user_id: string
    /**  | 用户密码MD5值 */
    pd: string
    /** 项目ID集合 */
    project_ids: Array<string>
    /** 0-工程物业中心、1-工程条线（部）、2-物业条线（部）、3-安品条线（部） */
    departType: 0 | 1 | 2 | 3
    /** 选中的月,格式为201811格式.必须.默认当前月 */
    selectedMonth: string
}

/** response interface | 本月巡检数据统计-项目 */
export interface IQueryProjectInspectDataResponse {
    Content: Array<{
        /** 项目Id */
        project_id: string
        /** 项目名称 */
        name: string
        /** 按时已完成点位 */
        pointTimeFNum: number
        /** 逾期已完成点位 */
        pointOverdueFNum: number
        /** 未完成点位 */
        pointUNum: number
        /** 及时完成率 */
        pointTimeFNumRate: number
    }>
    Result: 'success' | 'failure'
}

/** 工单(旧) - 本月巡检数据统计-项目
 *
 * @param {IQueryProjectInspectDataParams} params
 * @updateAt 2022-07-13 15:02
 */
export const queryProjectInspectData = async (
    params: IQueryProjectInspectDataParams
): Promise<IQueryProjectInspectDataResponse> => {
    return request.post('/workorder/appHomePageService/queryProjectInspectData', params)
}

/** params interface | 本月维保数据统计-项目 */
export interface IQueryProjectMaintainDataParams {
    /** 用户ID */
    user_id: string
    /** 用户密码MD5值 */
    pd: string
    /** 项目ID集合 */
    project_ids: Array<string>
    /** 0-工程物业安品、1-工程条线（部） */
    departType: 0 | 1
    /** 选中的月,格式为201811格式.必须.默认当前月     } */
    selectedMonth: string
}

/** response interface | 本月维保数据统计-项目 */
export interface IQueryProjectMaintainDataResponse {
    Result: 'success' | 'failure'
    Content: Array<{
        /** 项目Id */
        project_id: string
        /** 项目名称 */
        name: string
        /** 按时已完成点位 */
        pointTimeFNum: number
        /** 逾期已完成点位 */
        pointOverdueFNum: number
        /** 未完成点位 */
        pointUNum: number
        /** 及时完成率 */
        pointTimeFNumRate: number
    }>
}

/** 工单(旧) - 本月维保数据统计-项目
 *
 * @param {IQueryProjectMaintainDataParams} params
 * @updateAt 2022-07-13 15:43
 */
export const queryProjectMaintainData = async (
    params: IQueryProjectMaintainDataParams
): Promise<IQueryProjectMaintainDataResponse> => {
    return request.post('/workorder/appHomePageService/queryProjectMaintainData', params)
}

/** params interface | 本月维修(报修)数据统计-项目 */
export interface IQueryProjectRepairDataParams {
    /** 用户ID */
    user_id: string
    /** 用户密码MD5值 */
    pd: string
    /** 项目ID集合 */
    project_ids: Array<string>
    /** 0-工程物业中心、1-工程条线（部）、2-物业条线（部） */
    departType: 0 | 1 | 2
    /** 选中的月,格式为201811格式.必须.默认当前月     } */
    selectedMonth: string
}

/** response interface | 本月维修(报修)数据统计-项目 */
export interface IQueryProjectRepairDataResponse {
    Result: 'success' | 'failure'
    Content: Array<{
        /** 项目Id */
        project_id: string
        /** 项目名称 */
        name: string
        /** 已完成事件 */
        eventFNum: number
        /** 未完成事件 */
        eventOverdueUNum: number
        /** 未到期事件 */
        eventTimeUNum: number
        /** 及时完成率 */
        eventTimelyCompleteRate: number
    }>
}

/** 工单(旧) - 本月维修(报修)数据统计-项目
 *
 * @param {IQueryProjectRepairDataParams} params
 * @updateAt 2022-07-15 14:54
 */
export const queryProjectRepairData = async (
    params: IQueryProjectRepairDataParams
): Promise<IQueryProjectRepairDataResponse> => {
    return request.post('/workorder/appHomePageService/queryProjectRepairData', params)
}

/** params interface | 本月运行数据统计-项目 */
export interface IQueryProjectRunDataParams {
    /** 用户ID */
    user_id: string
    /** 用户密码MD5值 */
    pd: string
    /** 项目ID集合 */
    project_ids: Array<string>
    /** 0-工程物业中心、1-工程条线（部）、2-物业条线（部） */
    departType: 0 | 1 | 2
    /** 选中的月,格式为201811格式.必须.默认当前月     } */
    selectedMonth: string
}

/** response interface | 本月运行数据统计-项目 */
export interface IQueryProjectRunDataResponse {
    Result: 'success' | 'failure'
    Content: Array<{
        /** 项目Id */
        project_id: string
        /** 项目名称 */
        name: string
        /** 及时完成率 */
        pointTimeFNumRate: number
        /** 按时完成数 */
        pointTimeFNum: number
        /** 逾期完成数 */
        pointOverdueFNum: number
        pointUNum: number
    }>
}

/** 工单(旧) - 本月运行数据统计-项目
 *
 * @param {IQueryProjectRunDataParams} params
 * @updateAt 2022-07-13 15:45
 */
export const queryProjectRunData = async (
    params: IQueryProjectRunDataParams
): Promise<IQueryProjectRunDataResponse> => {
    return request.post('/workorder/appHomePageService/queryProjectRunData', params)
}

/** params interface | 年度工单数据统计 */
export interface IQueryWorkOrderDatasParams {
    /** 用户ID */
    user_id: string
    /** 用户密码Md5值 */
    pd: string
    /** 项目Id集合 */
    project_ids: Array<string>
}

/** response interface | 年度工单数据统计 */
export interface IQueryWorkOrderDatasResponse {
    Result: 'success' | 'failure'
    Item: {
        /** 管理建筑面积 */
        buildArea: number
        /** 年度维保总数 */
        maintenanceCountYearly: number
        /** 年度巡检总数 */
        inspectionCountYearly: number
        /** 年度工单总数 */
        workOrderYearly: number
    }
}

/** 工单(旧) - 年度工单数据统计
 *
 * @param {IQueryWorkOrderDatasParams} params
 * @updateAt 2022-07-13 15:02
 */
export const queryWorkOrderDatas = async (
    params: IQueryWorkOrderDatasParams
): Promise<IQueryWorkOrderDatasResponse> => {
    return request.post('/workorder/appHomePageService/queryWorkOrderDatas', params)
}

/** params interface | 设备健康度分析 */
export interface IEquipHealthDegreeAnalysisParams {
    /** 用户ID */
    user_id: string
    /** 用户密码Md5值 */
    pd: string
    /** 项目Id集合 */
    project_ids: Array<string>
}

/** response interface | 设备健康度分析 */
export interface IEquipHealthDegreeAnalysisResponse {
    Result: 'success' | 'failure'
    Item: {
        /** 管理建筑面积 */
        equipNum: number
        /** 设备健康数 */
        yxEquipNum: number
        /** 设备健康度 */
        equipRate: number
    }
}

/** 工单(旧) - 设备健康度分析
 *
 * @param {IEquipHealthDegreeAnalysisParams} params
 * @updateAt 2022-07-13 15:02
 */
export const equipHealthDegreeAnalysis = async (
    params: IEquipHealthDegreeAnalysisParams
): Promise<IEquipHealthDegreeAnalysisResponse> => {
    return request.post('/workorder/appHomePageService/equipHealthDegreeAnalysis', params)
}

/** params interface | 本月巡检数据统计-条线 */
export interface IQuerySingleProjectInspectDataParams {
    /** 当前用户ID */
    user_id: string
    /**  | 用户密码MD5值 */
    pd: string
    /** 项目ID */
    project_id: string
    /** 选中的月,格式为201811格式.必须.默认当前月 */
    selectedMonth: string
}

/** response interface | 本月巡检数据统计-条线 */
export interface IQuerySingleProjectInspectDataResponse {
    Result: 'success' | 'failure'
    Content: Array<{
        /** 项目名称 */
        name: string
        /** 按时已完成点位 */
        pointTimeFNum: number
        /** 逾期已完成点位 */
        pointOverdueFNum: number
        /** 未完成点位 */
        pointUNum: number
        /** 及时完成率 */
        pointTimeFNumRate: number
    }>
}

/** 工单(旧) - 本月巡检数据统计-条线
 *
 * @param {IQuerySingleProjectInspectDataParams} params
 * @updateAt 2022-07-13 15:02
 */
export const querySingleProjectInspectData = async (
    params: IQuerySingleProjectInspectDataParams
): Promise<IQuerySingleProjectInspectDataResponse> => {
    return request.post('/workorder/appHomePageService/querySingleProjectInspectData', params)
}

/** params interface | 本月维修(报修)数据统计-条线 */
export interface IQuerySingleProjectRepairDataParams {
    /** 当前用户ID */
    user_id: string
    /**  | 用户密码MD5值 */
    pd: string
    /** 项目ID */
    project_id: string
    /** 选中的月,格式为201811格式.必须.默认当前月 */
    selectedMonth: string
}

/** response interface | 本月维修(报修)数据统计-条线 */
export interface IQuerySingleProjectRepairDataResponse {
    Result: 'success' | 'failure'
    Content: Array<{
        /** 项目名称 */
        name: string
        /** 已完成事件 */
        eventFNum: number
        /** 未完成事件 */
        eventOverdueUNum: number
        /** 未到期事件 */
        eventTimeUNum: number
        /** 及时完成率 */
        eventTimelyCompleteRate: number
    }>
}

/** 工单(旧) - 本月维修(报修)数据统计-条线
 *
 * @param {IQuerySingleProjectRepairDataParams} params
 * @updateAt 2022-07-13 15:02
 */
export const querySingleProjectRepairData = async (
    params: IQuerySingleProjectRepairDataParams
): Promise<IQuerySingleProjectRepairDataResponse> => {
    return request.post('/workorder/appHomePageService/querySingleProjectRepairData', params)
}

/** params interface | 本月运行数据统计-条线 */
export interface IQuerySingleProjectRunDataParams {
    /** 当前用户ID */
    user_id: string
    /**  | 用户密码MD5值 */
    pd: string
    /** 项目ID */
    project_id: string
    /** 选中的月,格式为201811格式.必须.默认当前月 */
    selectedMonth: string
}

/** response interface | 本月运行数据统计-条线 */
export interface IQuerySingleProjectRunDataResponse {
    Result: 'success' | 'failure'
    Content: Array<{
        /** 项目名称 */
        name: string
        /** 已完成工单 */
        orderFNum: number
        /** 未完成工单 */
        orderUNum: number
        /** 及时完成率 */
        timelyCompleteRate: number
    }>
}

/** 工单(旧) - 本月运行数据统计-条线
 *
 * @param {IQuerySingleProjectRunDataParams} params
 * @updateAt 2022-07-13 15:02
 */
export const querySingleProjectRunData = async (
    params: IQuerySingleProjectRunDataParams
): Promise<IQuerySingleProjectRunDataResponse> => {
    return request.post('/workorder/appHomePageService/querySingleProjectRunData', params)
}

/** params interface | 安品-本月报修数据统计-时间 */
export interface IQueryAnPinRepairDataParams {
    /** 用户Id */
    user_id: string
    /** 用户密码MD5值 */
    pd: string
    /** 项目Id集合 */
    project_ids: Array<string>
    /** 3-安品条线（部） */
    departType: 3
    selectedMonth: string
}

/** response interface | 安品-本月报修数据统计-时间 */
export interface IQueryAnPinRepairDataResponse {
    Result: 'success' | 'failure'
    Content: Array<{
        /** 类别 */
        type: string
        /** 事件总数 */
        total: number
        /** 及时完成率 */
        eventTimelyCompleteRate: number
        /** 完成率 */
        eventCompleteRate: number
    }>
}

/** 工单(旧) - 安品-本月报修数据统计-时间
 *
 * @param {IQueryAnPinRepairDataParams} params
 * @updateAt 2022-07-29 10:37
 */
export const queryAnPinRepairData = async (
    params: IQueryAnPinRepairDataParams
): Promise<IQueryAnPinRepairDataResponse> => {
    return request.post('/workorder/appHomePageService/queryAnPinRepairData', params)
}

/** params interface | 安品-本月报修数据统计-项目 */
export interface IQueryProjectAnPinRepairDataParams {
    /** 用户Id */
    user_id: string
    /** 用户密码MD5值 */
    pd: string
    /** 项目Id集合 */
    project_ids: Array<string>
    /** 3-安品条线（部） */
    departType: 3
    selectedMonth: string
}

/** response interface | 安品-本月报修数据统计-项目 */
export interface IQueryProjectAnPinRepairDataResponse {
    Result: 'success' | 'failure'
    Content: Array<{
        /** 项目id */
        project_id: string
        /** 项目名称 */
        name: string
        /** 已完成事件 */
        eventFNum: number
        /** 未完成事件 */
        eventOverdueUNum: number
        /** 未到期事件 */
        eventTimeUNum: number
        /** 及时完成率 */
        eventTimelyCompleteRate: number
    }>
}

/** 工单(旧) - 安品-本月报修数据统计-项目
 *
 * @param {IQueryProjectAnPinRepairDataParams} params
 * @updateAt 2022-07-13 15:02
 */
export const queryProjectAnPinRepairData = async (
    params: IQueryProjectAnPinRepairDataParams
): Promise<IQueryProjectAnPinRepairDataResponse> => {
    return request.post('/workorder/appHomePageService/queryProjectAnPinRepairData', params)
}

/** params interface | 安品-本月报修数据统计-人员 */
export interface IQueryAnPinPersonRepairDataParams {
    /** 用户Id */
    user_id: string
    /** 用户密码MD5值 */
    pd: string
    /** 项目Id集合 */
    project_ids: Array<string>
    /** 3-安品条线（部） */
    departType: 3
    selectedMonth: string
    /** 单个项目ID */
    project_id: string
}

/** response interface | 安品-本月报修数据统计-人员 */
export interface IQueryAnPinPersonRepairDataResponse {
    Result: 'success' | 'failure'
    Content: Array<{
        /** 人员名称 */
        name: string
        /** 已完成事件 */
        eventFNum: number
        /** 未完成事件 */
        eventOverdueUNum: number
        /** 未到期事件 */
        eventTimeUNum: number
        /** 及时完成率 */
        eventTimelyCompleteRate: number
    }>
}

/** 工单(旧) - 安品-本月报修数据统计-人员
 *
 * @param {IQueryAnPinPersonRepairDataParams} params
 * @updateAt 2022-08-02 17:51
 */
export const queryAnPinPersonRepairData = async (
    params: IQueryAnPinPersonRepairDataParams
): Promise<IQueryAnPinPersonRepairDataResponse> => {
    return request.post('/workorder/appHomePageService/queryAnPinPersonRepairData', params)
}

/** response interface | 昨日管理人员KPI统计(单项目，多项目) */
export interface IGetMngPersonKPITaskResponse {}

/** 工单(旧) - 昨日管理人员KPI统计(单项目，多项目)
 *
 *
 * @updateAt 2022-07-13 15:02
 */
export const getMngPersonKPITask = async (): Promise<IGetMngPersonKPITaskResponse> => {
    return request.post('/workorder/appHomePageService/getMngPersonKPITask')
}
