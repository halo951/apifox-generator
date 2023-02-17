export interface ITreeNode {
    name: string;
    key: string;
    type: 'apiDetailFolder' | 'apiDetail';
    folder?: {
        id: number;
        parentId: number;
        type: 'http' | 'https';
    };
    api?: {
        id: number;
        type: 'http' | 'https';
        method: 'post' | 'get' | 'put' | 'delete' | 'option';
        path: string;
        folderId: number;
        tags: Array<any>;
        status: string;
        responsibleId: number;
        customApiFields: any;
    };
    children: Array<ITreeNode>;
}
export type TTreeNodes = Array<ITreeNode>;
