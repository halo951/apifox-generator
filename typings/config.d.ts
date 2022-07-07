import { IConfig } from './intf';
/** Apifox genetator 配置文件读取 & 生成 */
export declare class ConfigLoader {
    static configFilePath: Array<string>;
    static treeNodeListApi: string;
    static detailsApi: string;
    static loginApi: string;
    /** 配置 */
    config: IConfig;
    /** 配置文件存储地址 */
    configPath: string;
    exec(): Promise<{
        config: IConfig;
        treeNode: Array<any>;
        details: Array<any>;
    }>;
    loadConfig(): IConfig;
    updateConfig(): void;
    login(count?: number): Promise<string>;
    loadApiTreeNode(): Promise<any>;
    loadApiDetails(): Promise<any>;
    /** 读取api文件夹 */
    readApisDirectory(nodeTree: Array<any>, folders?: Array<{
        id: number;
        name: string;
    }>): {
        id: number;
        name: string;
    }[];
    /** 更新接口引用 */
    upgradeConfigFolders(folders: Array<{
        id: number;
        name: string;
    }>): boolean;
    /** 选择使用的接口文档集合 */
    selectUsageApiDoc(upgraded: boolean): Promise<void>;
    setOutDir(): Promise<void>;
    setRequestTemplate(): Promise<void>;
}
