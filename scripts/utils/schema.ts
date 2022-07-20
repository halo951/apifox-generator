export const transform = (
    schema: any,
    globalKey: Array<any>,
    globalHandleType: 'delete' | 'unrequire',
    parent?: any
): void => {
    for (const key in schema) {
        // add additionalProperties at false
        if (key === 'type' && !parent?.['properties']) schema['additionalProperties'] = false

        if (key === 'properties') {
            for (const k in schema['properties']) {
                const prop = schema['properties'][k]

                // remove global key
                if (!parent && globalKey.includes(k)) {
                    if (globalHandleType === 'delete') {
                        delete schema['properties'][k]
                    } else {
                        schema['description'] = '(全局变量) ' + schema['description']
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
        if (typeof schema[key] === 'object') transform(schema[key], globalKey, globalHandleType, schema)
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
