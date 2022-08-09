import { request } from '@/utils/request'

/** * - 租户老接口测试
 *
 * @apifox https://www.apifox.cn/web/project/1225216
 * @author apifox-generator
 */

/** params interface | 租户能耗费用报表 */
export interface IFNReportQueryTenantEnergyMoneyGridParams {
    projectId: string
    timeFrom: string
    timeTo: string
    energyTypeId: string
    pageIndex: number
    pageSize: number
    tenantLocalId: string
}

/** response interface | 租户能耗费用报表 */
export interface IFNReportQueryTenantEnergyMoneyGridResponse {}

/** 租户老接口测试 - 租户能耗费用报表
 *
 * @param {IFNReportQueryTenantEnergyMoneyGridParams} params
 * @updateAt 2022-08-09 17:14
 */
export const FNReportQueryTenantEnergyMoneyGrid = async (
    params: IFNReportQueryTenantEnergyMoneyGridParams
): Promise<IFNReportQueryTenantEnergyMoneyGridResponse> => {
    return request.post('/entrance/unifier/FNReportQueryTenantEnergyMoneyGrid', params)
}
