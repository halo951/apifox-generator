import type { IConfig } from './intf/IConfig';
/** 处理本地配置读取与更新 */
export declare class Loader {
    static configFilePath: Array<string>;
    /** 使用的配置文件地址 */
    configPath?: string;
    /** 原始配置 */
    origin: IConfig;
    /** 变更后配置 */
    config: IConfig;
    constructor();
    get exist(): boolean;
    /** 检查配置文件是否存在, 不存在提示创建 */
    check(): Promise<void>;
    /** 读取配置文件 */
    read(): void;
    /** 写入配置文件 */
    write(): void;
}
