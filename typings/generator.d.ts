import { ESLint } from 'eslint';
import { IConfig } from './intf/IConfig';
import { IDetail } from './intf/IDetail';
import { ITreeNode } from './intf/ITreeData';
import { IApiOriginInfo } from './intf/IApiOriginInfo';
import { Configure } from './configure';
declare type TCache = Array<{
    moduleName: string;
    comment: string;
    mapFile: string;
    header: string;
    context: string;
}>;
/** 基于 apifox 定义的接口生成器逻辑 */
export declare class Generator {
    config: IConfig;
    details: Array<IDetail>;
    eslint: ESLint;
    exec(configure: Configure): Promise<void>;
    /** 从treeNode中, 获取folder下所有接口集合 */
    findApisByFolder(treeList: Array<ITreeNode>, id?: string | number): Array<IDetail>;
    /** 查找组路径 */
    findGroupPath(id: string | number, list: Array<ITreeNode>): string;
    /** 检查 apis 集合内, 是否存在完全相同的 path  */
    checkDuplicatePath(apis: Array<IDetail>): void;
    /** 转换元数据为生成接口需要的信息 */
    transformApiInfo(detail: IDetail, duplicate: {
        [key: string]: number;
    }): Promise<IApiOriginInfo>;
    /** 基于模板生成文件结构
     *
     * @param {string} file 文件名
     * @param {string} groupName 组名
     * @param {string} groupPath 组路径
     * @param {number} size 接口数量
     * @returns {string} 文件头
     */
    generateHeader(file: string, groupName: string, groupPath: string, size: number): string;
    /** 生成文件内容 */
    generateContext(name: string, maps: Array<IApiOriginInfo>): string;
    /** 生成公共的导出文件 */
    generateIndexFile(cache: TCache): string;
    /** 输出文件 */
    outputFile(outDir: string, mapFile: string, header: string, context: string): Promise<void>;
}
export {};
