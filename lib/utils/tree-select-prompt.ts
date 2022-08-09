import chalk from 'chalk'

import { Prompt } from 'enquirer'

interface ITreeItem {
    id: any
    name: string
    children?: Array<ITreeItem>
}

interface ITree {
    value: ITreeItem
    show: boolean
    checked: boolean
    children?: Array<ITree>
}

interface ITreeSelectOptions {
    name?: string | (() => string)
    type?: string | (() => string)
    message?: string | (() => string) | (() => Promise<string>)
    initial?: Array<ITreeItem>
    required?: boolean
    choices: Array<ITreeItem>
    header?: string
    format?: (value: ITreeItem) => string | Promise<string>
    result?(value: string): string | Promise<string>
    skip?: ((state: object) => boolean | Promise<boolean>) | boolean
    validate?(value: string): boolean | Promise<boolean> | string | Promise<string>
    onSubmit?(name: string, value: any, prompt: typeof Prompt): boolean | Promise<boolean>
    onCancel?(name: string, value: any, prompt: typeof Prompt): boolean | Promise<boolean>
    stdin?: NodeJS.ReadStream
    stdout?: NodeJS.WriteStream
}

const Base: any = Prompt

const count = (arr?: Array<any>) => (arr ?? []).length
export class TreeSelectPrompt extends Base {
    value!: Array<ITreeItem>
    /** 列表 */
    tree: Array<ITree> = []
    /** 当前活动行在第几行 */
    active: number = 0
    /** 分页数据 */
    paging: Array<{ node: ITree; str: string }> = []

    constructor(options: ITreeSelectOptions) {
        super(options as any)
        this.tree = this.origin2tree(options.choices ?? [], options.initial ?? [])
        this.value = options.initial ?? []
    }

    /** 原始选项转化节点树 */
    origin2tree(choices: Array<ITreeItem>, initial: Array<ITreeItem>): Array<ITree> {
        let value: Array<ITree> = []
        for (const item of choices) {
            let selected: ITreeItem | undefined = initial.find((i) => i.id === item.id)
            let n: ITree = {
                value: { id: item.id, name: item.name },
                show: false,
                checked: !!selected,
                children: []
            }
            if (item.children) {
                n.children = this.origin2tree(item.children, selected?.children ?? [])
            } else {
                delete n.children
            }
            value.push(n)
        }
        return value
    }
    /** 节点树转化原始选项 */
    tree2origin(value: Array<ITree>): Array<ITreeItem> {
        let out: Array<ITreeItem> = []
        for (const item of value) {
            if (item.checked) {
                out.push(item.value)
            } else if (item.children) {
                let selected: Array<ITreeItem> = this.tree2origin(item.children)
                if (selected.length > 0) {
                    out = out.concat(selected)
                }
            }
        }
        return out
    }

    /** 上 */
    up(): void {
        if (this.active > 0) {
            this.active--
        } else {
            this.active = this.paging.length - 1
        }
        this.render()
    }
    /** 下 */
    down(): void {
        if (this.active <= this.paging.length - 1) {
            this.active++
        } else {
            this.active = 0
        }
        this.render()
    }
    /** 左 | 收起 */
    left(): void {
        // ? 是否包含子集, 包含则切换子集选中状态
        const n = this.paging.find((n, i) => i === this.active)
        const close = (node?: ITree) => {
            if (!node) return
            node.show = false
            if (node.children) {
                for (const c of node.children) close(c)
            }
        }
        close(n?.node)
        this.render()
    }
    /** 右 | 展开 */
    right(): void {
        // ? 是否包含子集, 包含则切换子集选中状态
        const n = this.paging.find((n, i) => i === this.active)
        if (n && count(n.node.children) > 0) {
            n.node.show = true
        }
        this.render()
    }

    /** 切换选中项 */
    space(): void {
        // ? 是否包含子集, 包含则切换子集选中状态
        const n = this.paging.find((n, i) => i === this.active)
        const select = (n: ITree, state: boolean) => {
            n.checked = state
            if (n.children) {
                for (const c of n.children) select(c, state)
            }
        }
        const check = (list: Array<ITree>) => {
            for (const item of list) {
                if (item.children && item.children.length > 0) {
                    let hasUnSelect: boolean = item.children.some((c) => !c.checked)
                    item.checked = !hasUnSelect
                    check(item.children)
                }
            }
        }
        if (n) select(n.node, !n.node.checked)
        check(this.tree)
        this.value = this.tree2origin(this.tree)
        this.render()
    }

    /** 生成渲染内容 */
    generateList(): string {
        const a = ['+', '-', chalk.blue('→'), '↓'] // +
        const s = ['⬡', chalk.blue('⬢')]
        const point = (tree: Array<ITree>, zIndex: number = 0) => {
            for (const node of tree) {
                let str: Array<string> = []
                let index = this.paging.length
                let prefix: string = ''
                str.push(new Array(zIndex).fill('  ').join(''))
                if (node.show) {
                    prefix = a[3]
                } else if (count(node.children) > 0) {
                    prefix = a[0]
                } else if (index === this.active) {
                    prefix = a[2]
                } else {
                    prefix = a[1]
                }
                str.push(prefix)
                str.push(node.checked ? s[1] : s[0])
                str.push(' ')
                str.push(node.value.name)

                let o = str.join(' ')
                this.paging.push({ node, str: index === this.active ? chalk.bgGray(o) : o })
                if (node.show && count(node.children) > 0) {
                    point(node.children ?? [], zIndex + 1)
                }
            }
        }
        this.paging = []
        point(this.tree)
        return this.paging.map((p) => p.str).join('\n')
    }

    /** 渲染 */
    async render(): Promise<void> {
        let { size } = this.state
        let prompt = ''
        let header = await this.header()
        let prefix = await this.prefix()
        let separator = await this.separator()
        let message = await this.message()

        if (this.options.promptLine !== false) {
            prompt = [prefix, message, separator, ''].join(' ')
            this.state.prompt = prompt
        }

        let help = (await this.error()) || (await this.hint())
        let body = await this.generateList()
        let footer = await this.footer()

        if (help && !prompt.includes(help)) prompt += ' ' + help

        this.clear(size)
        this.write([header, prompt, body, footer].filter(Boolean).join('\n'))
        this.write(this.margin[2])
        this.restore()
    }
}
