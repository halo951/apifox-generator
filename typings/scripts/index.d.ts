import { ConfigLoader } from './config';
import { Generator } from './generator';
import { IConfig } from './intf';
/** Api 映射文件 生成器 */
export default class ApifoxGenerator {
    /** 配置读取 */
    configLoader: ConfigLoader;
    /** 生成器 */
    generator: Generator;
    exec(): Promise<void>;
    point(config: IConfig): void;
}
