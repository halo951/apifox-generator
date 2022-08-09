/// <reference types="node" />
/** command loading util */
export default class CommandLoadingUtil {
    str: Array<string>;
    suffix: string;
    duration: number;
    timer: NodeJS.Timer;
    n: number;
    /** 显示 */
    show(): void;
    /** 销毁 */
    destory(): void;
    /** 渲染到命令行 */
    render(): void;
}
/** loading 装饰器 */
export declare const loading: (str?: string) => (_t: any, _m: string, desc: any) => any;
/** 各阶段消息打印 */
export declare const step: (opt: {
    start?: string;
    query?: string;
    success?: string;
    failure?: string;
    exit?: boolean;
}) => (_t: any, _m: string, desc: any) => any;
