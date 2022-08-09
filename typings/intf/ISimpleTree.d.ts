export interface ISimpleTree {
    id: string | number;
    name: string;
    children?: Array<ISimpleTree>;
}
export declare type TSimpleTrees = Array<ISimpleTree>;
