import type { IConfig } from './intf/IConfig';
import { TTreeNodes } from './intf/ITreeData';
import { TDetils } from './intf/IDetail';
import { TSimpleTrees } from './intf/ISimpleTree';
import { TSchemas } from './intf/ISchema';
/** 处理配置变更, 用户配置项输入 */
export declare class Configure {
    /** 配置 */
    config: IConfig;
    /** 接口关系 | 树图结构 */
    treeList: TTreeNodes;
    /** 接口信息 | 扁平列表结构 */
    details: TDetils;
    /** schema集合 | 用于结构映射数据记录 */
    schemas: TSchemas;
    run(config: IConfig, reset: boolean | string): Promise<IConfig>;
    /** 拉取接口数据 */
    pullData(): Promise<void>;
    /** 读取 api文件夹集合 */
    readApisDirectory(nodeTree: TTreeNodes, root?: TSimpleTrees): TSimpleTrees;
    /** 检查接口引用是否发生更新
     *
     * @description 先对tree进行扁平化操作, 然后 diff 出差集, 存在差集则发生了更新
     */
    checkApisIsUpgraded(n: TSimpleTrees, o: TSimpleTrees): boolean;
    /** 设置需要生成的接口
     *
     * @description
     *  - 如果数据源发生更改, 触发待生成结构项更新
     */
    multiSelectUsageApis(folders: TSimpleTrees, usage: TSimpleTrees): Promise<{
        id: string;
        name: string;
    }[]>;
    /** 设置接口别名 (接口文件名) */
    upgradeFileNameMap(): Promise<void>;
}
