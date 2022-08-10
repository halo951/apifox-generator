import chalk from 'chalk'
import fs from 'fs'
import fse from 'fs-extra'

import { apis } from '../apis'
import { IApiGroupNameMap, IGenerateTemplate } from '../intf/IConfig'
import { TSimpleTrees } from '../intf/ISimpleTree'
import { point } from './point'
const Enquirer = require('enquirer')
const { Snippet } = require('enquirer')

const enquirer = new Enquirer()

enquirer.use((vm: typeof enquirer) => {
    vm.on('keypress', () => {})
    // if user input 'ctrl + c', then exit current process.
    vm.on('cancel', () => process.exit(0))
})

const createMessage = (msg: string): Function => {
    return function (this: any) {
        if (this?.state?.status === 'submitted') {
            return chalk.gray(msg)
        } else {
            return msg
        }
    }
}

interface ITaskRunner<T, E> {
    /** step1. 输入 */
    input: () => Promise<E>
    /** step2. (可选) 执行 */
    exec?: (form: E) => T | Promise<T>
    max?: number
    maxErrorMessage?: string
}

/** 创建任务执行工具 */
const createTaskRunner = async <T, E>(opt: ITaskRunner<T, E>): Promise<T> => {
    const { input, exec, max, maxErrorMessage } = opt
    let form: any
    let res: T
    for (let n = 0; n < (max ?? 3); n++) {
        try {
            form = await input()
            if (!exec) return form
            res = await exec(form)
            return res
        } catch (error) {
            if (n + 1 !== (max ?? 3)) point.warn((error as Error).message)
        }
    }
    throw new Error(maxErrorMessage ?? '失败次数过多, 脚本退出')
}

/** 选择是否创建配置 */
export const runChoiceCreateForm = async (): Promise<boolean> => {
    return await createTaskRunner({
        input: async () => {
            const { create } = await enquirer.prompt({
                type: 'confirm',
                name: 'create',
                message: createMessage('缺少配置, 是否创建一个 apifox.rule.json 配置文件'),
                initial: true
            })

            return create
        }
    })
}

/** 导出目录配置 */
export const runOutputDirForm = async (outDir?: string): Promise<string> => {
    if (outDir) return outDir
    return await createTaskRunner({
        input: async () => {
            let create!: boolean
            const { outDir } = await enquirer.prompt({
                type: 'input',
                name: 'outDir',
                message: createMessage(`设置导出目录`),
                initial: './src/apis'
            })

            const existed: boolean = fs.existsSync(outDir)

            if (!existed) {
                const res = await enquirer.prompt({
                    type: 'confirm',
                    name: 'create',
                    message: createMessage(`导出目录 [${chalk.blue(outDir)}] 不存在, 是否创建`),
                    initial: true
                })
                create = res.create
            } else {
                point.success('path is existed.')
            }
            return { outDir, existed, create }
        },
        exec: async ({ outDir, existed, create }) => {
            if (create) fse.mkdirsSync(outDir)
            else if (!existed) process.exit(0)
            return outDir
        }
    })
}

/** 选择是否创建公共导出文件 */
export const runAppendIndexFileForm = async (appendIndexFile?: boolean): Promise<boolean> => {
    if (appendIndexFile !== undefined) return appendIndexFile
    return await createTaskRunner({
        input: async () => {
            const { appendIndexFile } = await enquirer.prompt({
                type: 'confirm',
                name: 'appendIndexFile',
                message: createMessage('是否创建公共导出文件 [index.ts]'),
                initial: true
            })
            return appendIndexFile
        }
    })
}

/** 设置项目模板 */
export const runTemplateForm = async (template: IGenerateTemplate): Promise<IGenerateTemplate> => {
    if (Object.keys(template ?? {}).length === 0) {
        const { def } = await enquirer.prompt({
            type: 'select',
            name: 'def',
            message: createMessage('是否使用默认生成模板'),
            choices: ['默认模板', '自定义模板'],
            initial: '默认模板'
        })
        if (def === '默认模板') {
            return {
                header: [
                    '/** [group-path] - [group-name]',
                    ' *',
                    ' * @apifox [apifox-url]',
                    ' * @size (启用接口数量) [api-size]个',
                    ' * ',
                    ' * @author apifox-generator',
                    ' */'
                ],
                requestUtil: 'request',
                /** 导入语句格式 */
                importSyntax: 'import { [requestUtil] } from [utilPath]',
                /** 请求工具地址 */
                utilPath: '@/utils/request',
                /** 全局请求参数变量 */
                globalRequestParams: {
                    extend: null,
                    keys: [],
                    filter: 'delete'
                },
                /** 全局响应变量 */
                globalResponseParams: {
                    extend: null,
                    keys: [],
                    filter: 'delete'
                }
            }
        } else {
            template = {} as any
        }
    }

    // 是否需要更新 util Path
    let needUpdateUtilPath!: boolean

    // ? 设置文件头样式
    if (!template.header) {
        const { result } = await new Snippet({
            name: 'header',
            message: createMessage('设置文件头样式'),
            template: [
                '/** {{header:[group-path] - [group-name]}}',
                ' *',
                ' * @apifox {{lib:[apifox-url]}}',
                ' * @size (启用接口数量) [api-size]',
                ' * ',
                ' * @author {{author:apifox-generator}}',
                ' */'
            ].join('\n'),
            header: [
                '**********************************************',
                ' - [group-path] | 当前组的上级文件夹名称 (在存在同名分组时, 可能有些用处)',
                ' - [group-name] | 组名 (apifox 文件夹名称)',
                ' - [file-name]  | 文件名',
                ' - [apifox-url] | 当前项目在apifox上的文件地址',
                ' - [api-size] | | 当前文件夹下生成的接口数量',
                '**********************************************'
            ].join('\n')
        }).run()
        template.header = result.split('\n')
    }

    // ? 设置导入语句格式
    if (!template.importSyntax) {
        let { importSyntax } = await enquirer.prompt({
            type: 'select',
            name: 'importSyntax',
            message: createMessage('设置导入语句格式'),
            choices: ['import { [requestUtil] } from [utilPath]', 'import [requestUtil] from [utilPath]']
        })
        template.importSyntax = importSyntax
    }

    // ? 设置请求工具
    if (!template.requestUtil) {
        let { requestUtil } = await enquirer.prompt({
            type: 'select',
            name: 'requestUtil',
            message: createMessage('选择请求工具'),
            header: [
                '*********************************************************************',
                '',
                'request - (推荐) axios.create() 创建的工具实例',
                'axios - axios 默认实例',
                'custom - 自定义请求工具, 需要实现 axios 请求方法',
                '* 注: 由于 fetch api 格式不同, 所以暂时没有实现基于fetch的渲染模板',
                '',
                '*********************************************************************'
            ].join('\n'),
            choices: ['request', 'axios', 'custom']
        })
        if (requestUtil === 'custom') {
            const res = await enquirer.prompt({
                type: 'input',
                name: 'requestUtil',
                message: createMessage('输入自定义请求工具名称'),
                initial: 'request'
            })
            requestUtil = res.requestUtil
        }
        template.requestUtil = requestUtil
        if (requestUtil === 'axios') {
            template.importSyntax = 'import [requestUtil] from [utilPath]'
        } else {
            needUpdateUtilPath = true
        }
    }
    // ? 设置工具地址
    if (needUpdateUtilPath) {
        const { confirm } = await enquirer.prompt({
            type: 'confirm',
            name: 'confirm',
            message: createMessage(`是否使用 [${chalk.blue('@/utils/' + template.requestUtil)}] 作为工具地址`),
            initial: true
        })
        const { utilPath } = await enquirer.prompt({
            type: 'input',
            name: 'utilPath',
            message: createMessage('请确认请求工具地址'),
            initial: `'@/utils/${template.requestUtil}'`,
            skip: confirm
        })
        template.utilPath = utilPath
    }

    if (!template.globalRequestParams) {
        point.step(`配置 ${chalk.magenta('(request params interface)')} 全局参数处理方式`)
        const { filter, keys } = await enquirer.prompt([
            {
                type: 'select',
                name: 'filter',
                message: createMessage(`过滤方式 <filter>`),
                choices: [
                    { name: 'delete (删除)', value: 'delete' },
                    { name: 'unrequire (非必填)', value: 'unrequire' }
                ],
                inittal: 'delete'
            },
            {
                type: 'list',
                name: 'keys',
                message: `全局变量keys <keys>`,
                initial: []
            }
        ])
        const { extend } = await enquirer.prompt({
            type: 'input',
            name: 'extend',
            message: createMessage(`父类 <extend>`),
            skip: keys.length === 0,
            initial: null
        })
        template.globalRequestParams = { extend, filter, keys }
    }

    if (!template.globalResponseParams) {
        point.step(`配置 ${chalk.magenta('(response data interface)')} 全局参数处理方式`)
        const { filter, keys } = await enquirer.prompt([
            {
                type: 'select',
                name: 'filter',
                message: createMessage(`过滤方式 <filter>`),
                choices: [
                    { name: 'delete (删除)', value: 'delete' },
                    { name: 'unrequire (非必填)', value: 'unrequire' }
                ],
                inittal: 'delete'
            },
            {
                type: 'list',
                name: 'keys',
                message: `全局变量keys <keys>`,
                initial: []
            }
        ])
        const { extend } = await enquirer.prompt({
            type: 'input',
            name: 'extend',
            message: createMessage(`父类 <extend>`),
            skip: keys.length === 0,
            initial: null
        })
        template.globalResponseParams = { extend, filter, keys }
    }
    return template
}

/** token 检查 及登录 */
export const runLoginForm = async (token?: string): Promise<string> => {
    if (token) return token
    return await createTaskRunner({
        input: async () => {
            const { form } = await enquirer.prompt({
                type: 'form',
                name: 'form',
                message: createMessage('launch login...'),
                choices: [
                    { name: 'account', message: '账号/邮箱' },
                    { name: 'password', message: '密码' }
                ]
            })
            return form
        },
        exec: async ({ account, password }) => {
            const res = await apis.login(account, password)
            const { data, success } = res.data
            if (!success) throw new Error('登录失败, 请重试')
            return data.accessToken
        }
    })
}

/** projectId 设置及检查 */
export const runProjectIdForm = async (token: string, projectId?: string): Promise<string> => {
    if (projectId) return projectId
    return await createTaskRunner({
        input: async () => {
            const { projectId } = await enquirer.prompt({
                type: 'input',
                name: 'projectId',
                header: chalk.yellow('!', '获取方式 (projectId): 通过apifox web端进入项目后, 从url参数中获取'),
                message: createMessage('projectId')
            })
            return projectId
        },
        exec: async (projectId) => {
            try {
                await apis.treeList(token, projectId)
                return projectId
            } catch (error) {
                throw new Error(`此项目[projectId: ${chalk.magenta(projectId)}]不存在, 请确认`)
            }
        }
    })
}

export const runSetApiFileNameMapForm = async (flatList: TSimpleTrees): Promise<Array<IApiGroupNameMap>> => {
    if (flatList.length === 0) return []
    return await createTaskRunner({
        input: async () => {
            const { form } = await enquirer.prompt({
                type: 'form',
                name: 'form',
                message: createMessage('设置接口映射文件名'),
                align: 'left',
                choices: flatList.map((item) => {
                    return { name: item.id, message: ' ' + item.name }
                }),
                validate(val: { [k: string | number | symbol]: string }) {
                    let failure: Array<string> = []
                    let names: Array<{ lab: any; v: any }> = []
                    for (const k in val) {
                        let lab = flatList.find((item) => item.id === k)?.name ?? ''
                        let v = val[k]
                        if (!v || v.trim() === '') {
                            failure.push(`${lab} - 未设置文件名`)
                        } else if (names.some((n) => n.v === v)) {
                            failure.push(
                                `${lab} - 命名 '${v}' 存在重复项. repeat: ${names.find((n) => n.v === v)?.lab}`
                            )
                        }
                        names.push({ lab, v })
                    }
                    if (failure.length > 0) {
                        let out = [
                            chalk.red('\n**************** 错误提示 *****************'),
                            chalk.cyan(failure.join('\n')),
                            chalk.red('******************************************')
                        ]
                        return out.join('\n')
                    }
                    return true
                }
            })
            return form
        },
        exec(form): Array<IApiGroupNameMap> {
            let out: Array<IApiGroupNameMap> = []
            for (const id in form) {
                const file: string = form[id]
                const name: string = flatList.find((f) => f.id === id)?.name ?? ''
                out.push({ id, name, file })
            }
            return out
        }
    })
}
