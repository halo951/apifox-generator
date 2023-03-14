import minimist from 'minimist'
import { Loader } from './loader'
import { Configure } from './configure'
import { Generator } from './generator'
import { MarkdownGenerator } from './markdown'

/** Api 映射文件 生成器 */
export default class ApifoxGenerator {
    /** 配置加载 & 写入工具 */
    loader: Loader = new Loader()

    /** 配置项管理 */
    configure: Configure = new Configure()

    /** 代码生成器 */
    generator: Generator = new Generator()

    /** markdown 生成器 */
    md: MarkdownGenerator = new MarkdownGenerator()

    async exec(): Promise<void> {
        const { reset, init, md } = minimist(process.argv)
        // ? use init
        if (init) return this.init()
        // ? check config is exists from current project.
        await this.loader.check()
        // # 读取配置
        await this.loader.read()
        // # 配置检查 & 用户输入
        await this.configure.run(this.loader.config, reset)
        // # 写入 & 更新配置文件
        await this.loader.write()
        if (md) {
            // -> 执行 - 生成 markdown 文档
            // -> 执行 - 生成
            await this.md.exec(this.configure)
        } else {
            // -> 执行 - 生成
            await this.generator.exec(this.configure)
        }
    }

    /** 初始化配置项 */
    async init(): Promise<void> {
        // # 配置检查 & 用户输入
        await this.configure.run(this.loader.config, true)
        // # 写入 & 更新配置文件
        await this.loader.write()
    }
}
