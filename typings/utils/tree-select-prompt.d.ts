/// <reference types="node" />
import { Prompt } from 'enquirer';
interface ITreeItem {
    id: any;
    name: string;
    children?: Array<ITreeItem>;
}
interface ITree {
    value: ITreeItem;
    show: boolean;
    checked: boolean;
    children?: Array<ITree>;
}
interface ITreeSelectOptions {
    name?: string | (() => string);
    type?: string | (() => string);
    message?: string | (() => string) | (() => Promise<string>);
    initial?: Array<ITreeItem>;
    required?: boolean;
    choices: Array<ITreeItem>;
    header?: string;
    format?: (value: ITreeItem) => string | Promise<string>;
    result?(value: string): string | Promise<string>;
    skip?: ((state: object) => boolean | Promise<boolean>) | boolean;
    validate?(value: string): boolean | Promise<boolean> | string | Promise<string>;
    onSubmit?(name: string, value: any, prompt: typeof Prompt): boolean | Promise<boolean>;
    onCancel?(name: string, value: any, prompt: typeof Prompt): boolean | Promise<boolean>;
    stdin?: NodeJS.ReadStream;
    stdout?: NodeJS.WriteStream;
}
declare const Base: any;
export declare class TreeSelectPrompt extends Base {
    value: Array<ITreeItem>;
    /** 列表 */
    tree: Array<ITree>;
    /** 当前活动行在第几行 */
    active: number;
    /** 分页数据 */
    paging: Array<{
        node: ITree;
        str: string;
    }>;
    constructor(options: ITreeSelectOptions);
    /** 原始选项转化节点树 */
    origin2tree(choices: Array<ITreeItem>, initial: Array<ITreeItem>): Array<ITree>;
    /** 节点树转化原始选项 */
    tree2origin(value: Array<ITree>): Array<ITreeItem>;
    /** 上 */
    up(): void;
    /** 下 */
    down(): void;
    /** 左 | 收起 */
    left(): void;
    /** 右 | 展开 */
    right(): void;
    /** 切换选中项 */
    space(): void;
    /** 生成渲染内容 */
    generateList(): string;
    /** 渲染 */
    render(): Promise<void>;
}
export {};
