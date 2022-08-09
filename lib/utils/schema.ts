import { IGlobalParams } from '../intf/IConfig'

/** 处理JSONSchema
 *
 * @description 主要用来处理 json2ts 使用的schema协议与apifox协议版本不同的问题
 * @param schema JSONScheam 数据
 * @param globalParams 全局参数处理方式
 * @param parent
 */
export const transform = (schema: any, globalParams: IGlobalParams, parent?: any): void => {
    if (schema instanceof Array) {
        for (const value of schema) transform(value, globalParams, schema)
    } else if (typeof schema === 'object') {
        if (typeof schema.title === 'string') {
            if (schema.description) {
                schema.description = schema.title + ' | ' + schema.description
            } else {
                schema.description = schema.title
            }
            delete schema.title
        }
        if (schema.properties && !parent) {
            for (const k in schema.properties) {
                if (globalParams.keys.includes(k)) {
                    if (globalParams.filter === 'delete') {
                        delete schema.properties[k]
                    } else {
                        schema.required = schema.required.filter((r: string) => r !== k)
                        let item = schema.properties[k]
                        if (item.title) {
                            item.title = '(全局变量) ' + item.title ?? ''
                        } else {
                            item.description = '(全局变量) ' + item.description ?? ''
                        }
                    }
                }
            }
        }
        for (const key in schema) {
            const value = schema[key]
            transform(value, globalParams, schema)
        }
    }
}

/** 添加接口继承的父类 */
export const appendParentInterface = (schame: any, parentInterface?: string | null): void => {
    if (schame && parentInterface && parentInterface.trim() !== '') {
        schame['extends'] = {
            title: parentInterface,
            type: 'any'
        }
    }
}
