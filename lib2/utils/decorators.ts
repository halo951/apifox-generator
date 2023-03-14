import { stdout } from 'single-line-log'
import { point } from './point'

/** command loading util */
export default class CommandLoadingUtil {
    str: Array<string> = ['█', '▇', '▆', '▅', '▄', '▃', '▂', '▁', '▂', '▃', '▄', '▅', '▇']

    suffix: string = '加载中...'

    duration: number = 120

    timer!: NodeJS.Timer

    n: number = 0

    /** 显示 */
    show(): void {
        this.timer = setInterval(() => this.render(), this.duration)
    }

    /** 销毁 */
    destory(): void {
        stdout('')
        clearInterval(this.timer)
    }

    /** 渲染到命令行 */
    render(): void {
        const index: number = this.n % this.str.length
        const out: string = `${this.str[index]}  ${this.suffix}`
        // > output
        stdout(out)
        this.n++
    }
}

/** loading 装饰器 */
export const loading = (str?: string) => {
    return function (_t: any, _m: string, desc: any): any {
        const origin = desc.value
        desc.value = async function () {
            const util: CommandLoadingUtil = new CommandLoadingUtil()
            util.suffix = str ?? util.suffix
            try {
                util.show()
                return await origin.call(this, ...arguments)
            } finally {
                util.destory()
            }
        }
    }
}

/** 各阶段消息打印 */
export const step = (opt: { start?: string; query?: string; success?: string; failure?: string; exit?: boolean }) => {
    return function (_t: any, _m: string, desc: any): any {
        const origin = desc.value
        const { start, query, success, failure, exit } = opt
        desc.value = async function () {
            try {
                if (query) point.query(query)
                else if (start) point.message(start)
                const res = await origin.call(this, ...arguments)
                if (success) point.success(success)
                return res
            } catch (e) {
                console.error(e)
                point.error(failure ?? (e as Error)?.message ?? 'runtime error')
                if (exit) process.exit(0)
            }
        }
    }
}
