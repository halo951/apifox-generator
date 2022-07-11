export const transform = (
    schema: any,
    globalKey: Array<any>,
    globalHandleType: 'delete' | 'unrequire',
    deep: number = 0
): void => {
    for (const key in schema) {
        // add additionalProperties at false
        if (key === 'type') schema['additionalProperties'] = false

        if (key === 'properties') {
            for (const k in schema['properties']) {
                const prop = schema['properties'][k]

                // remove global key
                if (deep === 0 && globalKey.includes(k)) {
                    if (globalHandleType === 'delete') {
                        delete schema['properties'][k]
                    } else {
                        schema['required'] = schema['required'].filter((key) => key !== k)
                    }
                }
                // title to description
                if (prop.title) {
                    if (prop.description) {
                        prop.description = prop.title + ' | ' + prop.description
                    } else {
                        prop.description = prop.title
                    }
                    delete prop.title
                }
            }
        }
        // deep object
        if (typeof schema[key] === 'object') transform(schema[key], globalKey, globalHandleType, deep + 1)
    }
}

/** 添加接口继承的父类 */
export const appendParentInterface = (schame: any, parentInterface: string): void => {
    if (parentInterface) {
        schame['extends'] = {
            title: parentInterface,
            type: 'any'
        }
    }
}
