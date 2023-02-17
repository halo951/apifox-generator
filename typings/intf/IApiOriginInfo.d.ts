export interface IApiOriginInfo {
    id: number | string;
    method: string;
    path: string;
    name: string;
    basename: string;
    createdAt: string;
    updatedAt: string;
    hasParams: boolean;
    /** 请求接口 .d.ts */
    params: string | null;
    /** 响应接口 .d.ts */
    responses: Array<string>;
    paramsName: string;
    responseNames: Array<string>;
    /** 是否存在restful api接口参数 */
    hasPathParams: boolean;
    /** restful api url路径参数接口名 */
    pathParamsName: string;
    /** restful api url路径参数接口内容 */
    pathParams: string | null;
}
