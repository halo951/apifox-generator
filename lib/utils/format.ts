import typescript from 'typescript'

/** 字符串转驼峰 */
export const formatToHump = (value: string): string => {
    return value.replace(/[\_\-](\w)/g, (_, letter) => letter.toUpperCase())
}

/** 转化为接口命名 */
export const formatInterfaceName = (value: string, suffix: string): string => {
    value = formatToHump(value)
    value = value.replace(/^([\w])/, (_, $1) => $1.toUpperCase())
    return `I${value}${suffix}`
}

/** 格式化接口命名后缀, 避免相同命名冲突 */
export const formatNameSuffixByDuplicate = (name: string, duplicate: { [key: string]: number }): string => {
    if (!duplicate[name]) {
        duplicate[name] = 1
    } else {
        duplicate[name]++
    }
    if (duplicate[name] === 1) {
        return name
    } else {
        const newName: string = name + (duplicate[name] - 1)
        // ? 处理仍然重复的情况
        if (duplicate[newName]) {
            return formatNameSuffixByDuplicate(name, duplicate)
        } else {
            return newName
        }
    }
}

/** 格式化接口命名, 避免占用关键字 */
export const formatNameByDisabledKeyword = (name: string): string => {
    // # 性能选项, js关键字都是小写, 所以当包含大写时, 可以忽略
    if (/A-Z/.test(name)) return name
    try {
        // ? 测试语句
        const testCodeSnippet: string = `export const function = (params: any) : any => {}`
        // console.log(testCodeSnippet)
        typescript.transpile(testCodeSnippet, {
            strict: true,
            declaration: true,
            target: 2
        })
        return name
    } catch (error) {
        console.log(error)
        return formatToHump('q_' + name)
    }
}
/** 清理 Restful Api风格 url 中的 参数段 */
export const clearRestfulApiUrlParams = (str: string) => {
    return str.replace(/[\$]{0,1}\{.+?\}/g, '')
}

/** 裁剪超长路径段
 *
 * @description 约定规则: 当多段 url 中段落数(以 / 分隔)超过阈值时, 从后向前裁剪多余部分
 */
export const splitLongNameByPath = (str: string, max: number): string => {
    const tmp: Array<string> = str.split('/')
    if (tmp.length > max) {
        return tmp.slice(tmp.length - max, tmp.length).join('/')
    } else {
        return str
    }
}

/** 裁剪超长单词
 *
 * @description 约定规则: 在不破坏单个路径段的情况下, 根据单词数量匹配url, 当超过阈值时, 从后向前裁剪多余的部分
 */
export const splitLongCamelCaseNameByPath = (str: string, max: number): string => {
    // 1. 按大写字符做分割符, 分割字符串
    const tmp: Array<string> = str.split('/')
    let count: number = 0
    let out = []
    for (let n = tmp.length - 1; n >= 0; n--) {
        if (count >= max) break
        const block: string = tmp[n]
        // ! 注意这里`非`匹配会多匹配一位, 计算时需减 1
        const matched = block.match(/(?![a-z0-9])/g)
        count += matched?.length ?? 0
        out.unshift(block)
    }
    return out.join('/')
}

/** 裁剪获取url段落中最后一段 (非Restful api path部分)  */
export const urlLastParagraph = (url: string): string | null => {
    const paragraphs: Array<string> = url.split('/')
    // > 从后向前获取url路径段中, 非Restful Api path 参数部分
    let paragraph: string | null = paragraphs.reverse().reduce((out: string | null, paragraph: string) => {
        if (out) return out
        if (/[\$]{0,1}\{.+?\}/.test(paragraph)) return null
        return paragraph
    }, null)
    return paragraph
}
