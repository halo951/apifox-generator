import { Loader } from './loader';
import { Configure } from './configure';
import { Generator } from './generator';
/** Api 映射文件 生成器 */
export default class ApifoxGenerator {
    /** 配置加载 & 写入工具 */
    loader: Loader;
    /** 配置项管理 */
    configure: Configure;
    /** 代码生成器 */
    generator: Generator;
    exec(): Promise<void>;
    /** 初始化配置项 */
    init(): Promise<void>;
}
