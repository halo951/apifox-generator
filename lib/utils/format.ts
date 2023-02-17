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
    name += duplicate[name] === 1 ? '' : duplicate[name] - 1
    return name
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
