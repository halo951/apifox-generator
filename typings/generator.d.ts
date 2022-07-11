import { ESLint } from 'eslint';
import { IConfig, IDetail, ITreeNode, IApiOriginInfo } from './intf';
/** 基于 apifox 定义的接口生成器逻辑 */
export declare class Generator {
    config: IConfig;
    details: Array<IDetail>;
    eslint: ESLint;
    exec(config: IConfig, treeNode: Array<ITreeNode>, details: Array<IDetail>, mock?: boolean): Promise<void>;
    /** 从treeNode中, 获取folder下所有接口集合 */
    findApisByFolder(treeNode: Array<ITreeNode>, id?: number): Array<IDetail>;
    /** 检查 apis 集合内, 是否存在完全相同的 path  */
    checkDuplicatePath(apis: Array<IDetail>): void;
    /** 转换元数据为生成接口需要的信息 */
    transformApiInfo(detail: IDetail, duplicate: {
        [key: string]: number;
    }): Promise<IApiOriginInfo>;
    /** 基于模板生成文件结构 */
    generateHeader(folderName: string): string;
    /** 生成文件内容 */
    generateContext(name: string, maps: Array<IApiOriginInfo>): string;
    /** 输出文件 */
    outputFile(outDir: string, mapFile: string, header: string, context: string): Promise<void>;
}
