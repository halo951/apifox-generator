import { request } from '@/utils/request'

/** * - 租户付费管理
 *
 * @apifox https://www.apifox.cn/web/project/1225216
 * @author apifox-generator
 */

/** params interface | 租户电能耗报表（分时区间） */
export interface IFNReportQueryDianEnergyMoneyGridParams {
    meterLocalId: string
    energyTypeId: string
    pageIndex: number
    pageSize: number
    projectId: string
    timeFrom: string
    timeTo: string
}

/** response interface | 租户电能耗报表（分时区间） */
export interface IFNReportQueryDianEnergyMoneyGridResponse {
    /** 序号 */
    id: string
    /** 租户编号 */
    tenantLocalId: string
    /** 租户名称 */
    tenantLocalName: string
    /** 表号 */
    meterLocalId: string
    /** 计费类型 */
    energyType: string
    /** 付费方式 */
    payType: string
    /** 计费方式 */
    chargeMode: string
    /** 日期数据 */
    data: {
        /** 起始日期 */
        startDate: string
        /** 截止日期 */
        endDate: string
        /** 起始度数 */
        startDegree: number
        /** 截止度数 */
        endDegree: number
        /** 段号 */
        segment: string
        /** 倍率 */
        cTRatio: string
        /** 费用 */
        money: number
        /** 单价 */
        unitPrice: number
        /** 用量 */
        energy: number
    }
}

/** 租户付费管理 - 租户电能耗报表（分时区间）
 *
 * @param {IFNReportQueryDianEnergyMoneyGridParams} params
 * @updateAt 2022-08-04 18:09
 */
export const FNReportQueryDianEnergyMoneyGrid = async (
    params: IFNReportQueryDianEnergyMoneyGridParams
): Promise<IFNReportQueryDianEnergyMoneyGridResponse> => {
    return request.post('/FNReportQueryDianEnergyMoneyGrid', params)
}

/** response interface | 下载租户电能耗报表（分时区间） */
export interface IFNReportDownloadDianEnergyMoneyGridResponse {}

/** 租户付费管理 - 下载租户电能耗报表（分时区间）
 *
 *
 * @updateAt 2022-08-09 18:40
 */
export const FNReportDownloadDianEnergyMoneyGrid = async (): Promise<IFNReportDownloadDianEnergyMoneyGridResponse> => {
    return request.post('/FNReportDownloadDianEnergyMoneyGrid')
}

/** params interface | 上传批量充值 */
export interface IFNUploadBatchRechargeServiceParams {
    /** 资源路径 */
    resourceId: string
    userId: string
    userName: string
}

/** response interface | 上传批量充值 */
export interface IFNUploadBatchRechargeServiceResponse {
    /** 下载资源id */
    id?: string
    /** 成功数 */
    successNum: number
    /** 失败数 */
    failNum: number
}

/** 租户付费管理 - 上传批量充值
 *
 * @param {IFNUploadBatchRechargeServiceParams} params
 * @updateAt 2022-08-08 17:56
 */
export const FNUploadBatchRechargeService = async (
    params: IFNUploadBatchRechargeServiceParams
): Promise<IFNUploadBatchRechargeServiceResponse> => {
    return request.post('/FNUploadBatchRechargeService', params)
}

/** params interface | 上传批量退费 */
export interface IFNUploadBatchRefundServiceParams {
    resourceId: string
    userId: string
    userName: string
}

/** response interface | 上传批量退费 */
export interface IFNUploadBatchRefundServiceResponse {
    id: string
    successNum: string
    failNum: string
}

/** 租户付费管理 - 上传批量退费
 *
 * @param {IFNUploadBatchRefundServiceParams} params
 * @updateAt 2022-08-08 17:57
 */
export const FNUploadBatchRefundService = async (
    params: IFNUploadBatchRefundServiceParams
): Promise<IFNUploadBatchRefundServiceResponse> => {
    return request.post('/FNUploadBatchRefundService', params)
}

/** params interface | 下载模板 */
export interface IFNCConfigTemplateDownloadServiceParams {
    /**
     *  | batch_recharge 批量充值模板
     * batch_refund 批量退费模板
     */
    logicCode: string
}

/** response interface | 下载模板 */
export interface IFNCConfigTemplateDownloadServiceResponse {
    'id ': string
}

/** 租户付费管理 - 下载模板
 *
 * @param {IFNCConfigTemplateDownloadServiceParams} params
 * @updateAt 2022-08-05 11:40
 */
export const FNCConfigTemplateDownloadService = async (
    params: IFNCConfigTemplateDownloadServiceParams
): Promise<IFNCConfigTemplateDownloadServiceResponse> => {
    return request.post('/FNCConfigTemplateDownloadService', params)
}

/** params interface | 异常记录 */
export interface IFNRemoteOrderErrorListParams {
    endTime: string
    energyTypeId: string
    operateType: string
    orderType: string
    pageIndex: string
    pageSize: string
    projectId: string
    sortMap: {
        field: string
        orderType: string
    }
    startTime: string
    systemCode: string
    tenantLocalName: string
    type: string
}

/** response interface | 异常记录 */
export interface IFNRemoteOrderErrorListResponse {
    content: string
    energyTypeId: string
    meterLocalId: string
    meterProtocolId: string
    operateType: string
    orderId: string
    orderTime: string
    status: string
    systemCode: string
    systemName: string
    tenantLocalId: string
    tenantLocalName: string
    userName: string
    rechargeMode: string
    rechargeRemark: string
    refundMode: string
    refundRemark: string
}

/** 租户付费管理 - 异常记录
 *
 * @param {IFNRemoteOrderErrorListParams} params
 * @updateAt 2022-08-08 18:03
 */
export const FNRemoteOrderErrorList = async (
    params: IFNRemoteOrderErrorListParams
): Promise<IFNRemoteOrderErrorListResponse> => {
    return request.post('/FNRemoteOrderErrorList', params)
}

/** response interface | 已关闭记录 */
export interface IFNRemoteOrderCloseListResponse {}

/** 租户付费管理 - 已关闭记录
 *
 *
 * @updateAt 2022-08-04 10:45
 */
export const FNRemoteOrderCloseList = async (): Promise<IFNRemoteOrderCloseListResponse> => {
    return request.post('/FNRemoteOrderCloseList')
}

/** response interface | 其他记录 */
export interface IFNRemoteOrderOtherListResponse {}

/** 租户付费管理 - 其他记录
 *
 *
 * @updateAt 2022-08-04 10:45
 */
export const FNRemoteOrderOtherList = async (): Promise<IFNRemoteOrderOtherListResponse> => {
    return request.post('/FNRemoteOrderOtherList')
}
