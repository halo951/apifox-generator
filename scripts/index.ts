import minimist from 'minimist'
import { ConfigLoader } from './config'

import { inputConfirm } from './utils/input'
import { Generator } from './generator'
import { IConfig } from './intf'

/** Api 映射文件 生成器 */
export default class ApifoxGenerator {
    /** 配置读取 */
    configLoader: ConfigLoader = new ConfigLoader()
    /** 生成器 */
    generator: Generator = new Generator()

    async exec(): Promise<void> {
        const { q: quick, m: mock } = minimist(process.argv)
        console.log('> 读取配置...')
        const { config, treeNode, details } = await this.configLoader.exec()
        // 提示确认配置项, 配置项有误则

        if (!quick) {
            this.point(config)
            console.log('> 请确认生成配置, 下一步将生成 apis 文件,.', '\n> 如配置有误, 需要取消, 并修改配置文件选项')
            const confirmed: boolean = await inputConfirm('是否采用上述配置生成:')
            if (!confirmed) return console.log('> 已取消')
        }

        // 执行生成过程.
        this.generator.exec(config, treeNode, details, mock)
    }

    point(config: IConfig) {
        const out: IConfig = JSON.parse(JSON.stringify(config))
        delete out.Authorization
        delete out.floders
        out.requestTemplate = out.requestTemplate.name as any
        out.usage = out.usage.map((u) => ({ name: u.name, mapFile: u.mapFile })) as any
        console.log('-------------------------')
        console.log(JSON.stringify(out, null, 4))
        console.log('-------------------------')
    }
}
