export interface IDetail {
    tags: Array<any>;
    status: string;
    requestBody: {
        type: 'application/json';
        parameters: Array<any>;
        jsonSchema: any;
        required: Array<string>;
        'x-apifox-orders': Array<string>;
    };
    responses: Array<{
        jsonSchema: any;
        defaultEnable: boolean;
        id: number;
        name: string;
        apiDetailId: number;
        projectId: number;
        code: 200 | number;
        contentType: 'json';
        ordering: number;
        createdAt: string | null;
        updatedAt: string | null;
        deletedAt: string | null;
        responseExamples: Array<any>;
    }>;
    parameters: {
        path: Array<any>;
        query: Array<any>;
    };
    commonParameters: {
        query: Array<any>;
        body: Array<any>;
        cookie: Array<any>;
        header: Array<any>;
    };
    auth: any;
    commonResponseStatus: any;
    advancedSettings: any;
    mockScript: any;
    id: string | number;
    name: string;
    type: 'http' | 'https';
    serverId: string;
    description: string;
    operationId: string;
    sourceUrl: string;
    method: 'post' | 'get' | 'put' | 'delete' | 'option';
    path: string;
    customApiFields: any;
    projectId: number;
    folderId: number;
    ordering: number;
    creatorId: number;
    editorId: number;
    responsibleId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}
export type TDetils = Array<IDetail>;
