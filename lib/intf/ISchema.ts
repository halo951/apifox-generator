import { JSONSchema } from 'json-schema-to-typescript'

export interface ISchema {
    jsonSchema: JSONSchema
    id: number
    name: string
    folderId: number
    description: string
    projectId: number
    ordering: number
    creatorId: number
    editorId: number
    createdAt: string | null
    updatedAt: string | null
    deletedAt: string | null
}

export type TSchemas = Array<ISchema>
