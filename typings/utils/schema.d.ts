import { IGlobalParams } from '../intf/IConfig';
import { TDetils } from '../intf/IDetail';
import { TSchemas } from '../intf/ISchema';
/** 处理JSONSchema
 *
 * @description 主要用来处理 json2ts 使用的schema协议与apifox协议版本不同的问题
 * @param schema JSONScheam 数据
 * @param globalParams 全局参数处理方式
 * @param parent
 */
export declare const transform: (schema: any, globalParams: IGlobalParams, parent?: any) => void;
/** 添加接口继承的父类 */
export declare const appendParentInterface: (schema: any, parentInterface?: string | null) => void;
/** 将外部映射的 schema 写入到detail内
 *
 * @description 注意: 可能会引发 无限循环问题, 目前改了改暂时先这么用~
 */
export declare const transformSchemaRef: (details?: TDetils, schemas?: TSchemas) => void;
/** 移除已废弃API */
export declare const removeDeprecatedApi: (details?: TDetils) => TDetils;
