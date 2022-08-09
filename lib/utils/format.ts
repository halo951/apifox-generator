export const formatToHump = (value: string): string => {
    return value.replace(/[\_\-](\w)/g, (_, letter) => letter.toUpperCase())
}

export const formatInterfaceName = (value: string, suffix: string): string => {
    value = formatToHump(value)
    value = value.replace(/^([\w])/, (_, $1) => $1.toUpperCase())
    return `I${value}${suffix}`
}

export const formatNameSuffixByDuplicate = (name: string, duplicate: { [key: string]: number }): string => {
    if (!duplicate[name]) {
        duplicate[name] = 1
    } else {
        duplicate[name]++
    }

    name += duplicate[name] === 1 ? '' : duplicate[name] - 1

    return name
}
