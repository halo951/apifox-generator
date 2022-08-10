import { AxiosResponse } from 'axios';
declare class Apis {
    /** 登录 */
    login(account: string, password: string): Promise<AxiosResponse<any>>;
    treeList(token: string, projectId: string): Promise<AxiosResponse<any>>;
    details(token: string, projectId: string): Promise<AxiosResponse<any>>;
    schema(token: string, projectId: string): Promise<AxiosResponse<any>>;
}
export declare const apis: Apis;
export {};
