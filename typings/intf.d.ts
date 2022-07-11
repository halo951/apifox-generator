export interface IConfig {
    /** 项目Id */
    projectId?: string;
    /** 登录token */
    Authorization?: string;
    floders: Array<{
        id: number;
        name: string;
    }>;
    /** 需要映射的接口 */
    usage: Array<{
        id: number;
        name: string;
        mapFile: string;
    }>;
    /** 配置输出目录 */
    outDir: string;
    /** request 工具模板 */
    requestTemplate: {
        name: 'request util' | 'basic axios';
        headerComment: string | Array<string>;
        importSyntax: string;
        requestUtil: string;
        responseExtend: string | null;
        globalParamsKey: Array<string>;
        globalResponseKey: Array<string>;
        globalParamsFilter: 'delete' | 'unrequire';
        globalResponseFilter: 'delete' | 'unrequire';
    };
}
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
    parameters: Array<any>;
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
    id: number;
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
export interface IApiOriginInfo {
    id: number;
    method: string;
    path: string;
    name: string;
    basename: string;
    createdAt: string;
    updatedAt: string;
    hasParams: boolean;
    /** 请求接口 .d.ts */
    params: string;
    /** 响应接口 .d.ts */
    responses: Array<string>;
    paramsName: string;
    responseNames: Array<string>;
}
