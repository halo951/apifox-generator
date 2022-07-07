import { ESLint } from 'eslint';
import { IConfig, IDetail, ITreeNode, IApiOriginInfo } from './intf';
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
    /** 对相同 basename 的接口, 增加序号后缀
     *
     * @description 注: 相同path的, 给定相同的 basename (用于检查后端定义的接口地址是否重复)
     */
    transformDuplicateApiNames(maps: Array<IApiOriginInfo>): void;
    /** 基于模板生成文件结构 */
    generateHeader(folderName: string): string;
    /** 生成文件内容 */
    generateContext(name: string, maps: Array<IApiOriginInfo>): string;
    /** 输出文件 */
    outputFile(outDir: string, mapFile: string, header: string, context: string): Promise<void>;
}
