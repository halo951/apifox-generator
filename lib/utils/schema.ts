import { IGlobalParams } from '../intf/IConfig'
import { TDetils } from '../intf/IDetail'
import { TSchemas } from '../intf/ISchema'
import { klona } from 'klona'

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
        // # 处理协议格式
        if (typeof schema.title === 'string') {
            if (schema.description) {
                schema.description = schema.title + ' | ' + schema.description
            } else {
                schema.description = schema.title
            }
            delete schema.title
        }
        // # 处理全局变量
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
export const appendParentInterface = (schema: any, parentInterface?: string | null): void => {
    if (schema && parentInterface && parentInterface.trim() !== '') {
        schema['extends'] = {
            title: parentInterface,
            type: 'any'
        }
    }
}

/** 将外部映射的 schema 写入到detail内
 *
 * @description 注意: 可能会引发 无限循环问题, 目前改了改暂时先这么用~
 */
export const transformSchemaRef = (details: TDetils = [], schemas: TSchemas = []): void => {
    const deep = (schema: any) => {
        if (schema instanceof Array) {
            // 遍历数组
            for (const c of schema) deep(c)
        } else if (typeof schema === 'object') {
            if (schema && schema.$ref) {
                const [, , rid] = schema.$ref.split('/')
                delete schema.$ref
                const ref = schemas.find(({ id }) => id.toString() === rid)
                if (ref) {
                    Object.assign(schema, klona(ref.jsonSchema))
                    delete schema.$ref
                }
            }
            // 向下遍历子节点
            for (const k in schema) deep(schema[k])
        }
    }
    deep(schemas)
    deep(details)
}

/** 移除已废弃API */
export const removeDeprecatedApi = (details: TDetils = []): TDetils => {
    return details.filter((d) => d.status !== 'deprecated')
}
