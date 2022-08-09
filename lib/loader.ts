import type { IConfig } from './intf/IConfig'

import * as fs from 'fs'
import * as np from 'path'
import { parse, assign, stringify } from 'comment-json'
import { runChoiceCreateForm } from './utils/forms'
import { step } from './utils/decorators'

/** 处理本地配置读取与更新 */
export class Loader {
    static configFilePath: Array<string> = ['apifox.rule.json'].map((r) => np.join(process.cwd(), r))

    /** 使用的配置文件地址 */
    configPath?: string

    /** 原始配置 */
    origin!: IConfig

    /** 变更后配置 */
    config!: IConfig

    constructor() {
        this.configPath = Loader.configFilePath.find((path) => fs.existsSync(path)) || undefined
    }

    get exist(): boolean {
        return !!Loader.configFilePath.find((path) => fs.existsSync(path))
    }

    /** 检查配置文件是否存在, 不存在提示创建 */
    @step({ query: 'check config file is exist' })
    async check(): Promise<void> {
        // ? check
        if (this.exist) return
        const create = await runChoiceCreateForm()
        if (create) {
            // write and read now
            this.write()
        } else {
            process.exit(0)
        }
    }

    /** 读取配置文件 */
    @step({ success: 'read config' })
    read(): void {
        if (!this.configPath) return
        const fi: string = fs.readFileSync(this.configPath, { encoding: 'utf-8' })
        this.origin = parse(fi) as any as IConfig
        this.config = this.origin ?? {}
    }

    /** 写入配置文件 */
    @step({ success: 'write to file', failure: 'write config failure', exit: true })
    write(): void {
        if (!this.configPath) {
            this.configPath = Loader.configFilePath[0]
        }
        const out: string = stringify(assign(this.config ?? {}, this.origin ?? {}), null, 4)
        fs.writeFileSync(this.configPath, out, { encoding: 'utf-8' })
    }
}
