/** 字符串转驼峰 */
export declare const formatToHump: (value: string) => string;
/** 转化为接口命名 */
export declare const formatInterfaceName: (value: string, suffix: string) => string;
/** 格式化接口命名后缀, 避免相同命名冲突 */
export declare const formatNameSuffixByDuplicate: (name: string, duplicate: {
    [key: string]: number;
}) => string;
/** 格式化接口命名, 避免占用关键字 */
export declare const formatNameByDisabledKeyword: (name: string) => string;
/** 清理 Restful Api风格 url 中的 参数段 */
export declare const clearRestfulApiUrlParams: (str: string) => string;
