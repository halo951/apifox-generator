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
/** 裁剪超长路径段
 *
 * @description 约定规则: 当多段 url 中段落数(以 / 分隔)超过阈值时, 从后向前裁剪多余部分
 */
export declare const splitLongNameByPath: (str: string, max: number) => string;
/** 裁剪超长单词
 *
 * @description 约定规则: 在不破坏单个路径段的情况下, 根据单词数量匹配url, 当超过阈值时, 从后向前裁剪多余的部分
 */
export declare const splitLongCamelCaseNameByPath: (str: string, max: number) => string;
