import prompts from 'prompts'

export const inputText = async (message: string) => {
    const { value } = await prompts({
        name: 'value',
        message,
        type: 'text'
    })
    return value
}

export const inputConfirm = async (message: string) => {
    const { value } = await prompts({
        name: 'value',
        type: 'confirm',
        message
    })
    return value
}

export const inputMultiSelect = async <T>(
    message: string,
    choices: Array<{ title: string; value: T }>
): Promise<Array<T>> => {
    const { list } = await prompts({
        type: 'multiselect',
        name: 'list',
        message,
        choices
    })
    return list
}

export const inputSelect = async <T>(message: string, choices: Array<{ title: string; value: T }>): Promise<T> => {
    const { item } = await prompts({
        type: 'select',
        name: 'item',
        message,
        choices
    })
    return item
}
