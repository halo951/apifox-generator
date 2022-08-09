export interface ISimpleTree {
    id: string | number
    name: string
    children?: Array<ISimpleTree>
}

export type TSimpleTrees = Array<ISimpleTree>
