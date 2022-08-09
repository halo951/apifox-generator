import { IGlobalParams } from '../intf/IConfig';
/** 处理JSONSchema
 *
 * @description 主要用来处理 json2ts 使用的schema协议与apifox协议版本不同的问题
 * @param schema JSONScheam 数据
 * @param globalParams 全局参数处理方式
 * @param parent
 */
export declare const transform: (schema: any, globalParams: IGlobalParams, parent?: any) => void;
/** 添加接口继承的父类 */
export declare const appendParentInterface: (schame: any, parentInterface?: string | null) => void;
