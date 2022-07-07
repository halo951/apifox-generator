export const formatToHump = (value: string): string => {
    return value.replace(/[\_\-](\w)/g, (_, letter) => letter.toUpperCase())
}

export const formatInterfaceName = (value: string, suffix: string): string => {
    value = formatToHump(value)
    value = value.replace(/^([\w])/, (_, $1) => $1.toUpperCase())
    return `I${value}${suffix}`
}
