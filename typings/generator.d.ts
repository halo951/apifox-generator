import { ESLint } from 'eslint';
import { IConfig, IDetail, ITreeNode } from './intf';
export interface IApiOriginInfo {
    method: string;
    path: string;
    name: string;
    basename: string;
    createdAt: string;
    updatedAt: string;
    hasParams: boolean;
    /** 请求接口 .d.ts */
    params: string;
    /** 响应接口 .d.ts */
    responses: Array<string>;
    paramsName: string;
    responseNames: Array<string>;
}
/** 基于 apifox 定义的接口生成器逻辑 */
export declare class Generator {
    config: IConfig;
    details: Array<IDetail>;
    eslint: ESLint;
    exec(config: IConfig, treeNode: Array<ITreeNode>, details: Array<IDetail>, mock?: boolean): Promise<void>;
    /** 从treeNode中, 获取folder下所有接口集合 */
    findApisByFolder(treeNode: Array<ITreeNode>, id?: number): Array<{
        node: ITreeNode;
        detail: IDetail;
    }>;
    /** 转换元数据为生成接口需要的信息 */
    transformApiInfo(detail: IDetail): Promise<IApiOriginInfo>;
    /** 基于模板生成文件结构 */
    generateHeader(folderName: string): string;
    /** 生成文件内容 */
    generateContext(name: string, maps: Array<IApiOriginInfo>): string;
    /** 输出文件 */
    outputFile(outDir: string, mapFile: string, header: string, context: string): Promise<void>;
}
