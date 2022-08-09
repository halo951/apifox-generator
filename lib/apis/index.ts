import axios, { AxiosResponse } from 'axios'
import { loading } from '../utils/decorators'

const request = axios.create({
    baseURL: 'https://api.apifox.cn/',
    headers: {
        Origin: 'https://www.apifox.cn',
        'X-Client-Mode': 'web',
        'X-Client-Version': '2.1.17-alpha.3',
        'X-Device-Id': 'xW9HUp7S8CME0TSuW8t5yc5MEyeYw2uHq0R71neRktaketlfC9UQOGcwwOpyED43'
    },
    data: { locale: 'zh-CN' }
})

class Apis {
    /** 登录 */
    @loading('登录中...')
    async login(account: string, password: string): Promise<AxiosResponse<any>> {
        return await request({ method: 'POST', url: '/api/v1/login', data: { account, password } })
    }

    @loading('load list...')
    async treeList(token: string, projectId: string): Promise<AxiosResponse<any>> {
        return request({
            url: '/api/v1/api-tree-list',
            headers: { Authorization: token, 'X-Project-Id': projectId }
        })
    }

    @loading('load details...')
    async details(token: string, projectId: string): Promise<AxiosResponse<any>> {
        return request({ url: '/api/v1/api-details', headers: { Authorization: token, 'X-Project-Id': projectId } })
    }
}

export const apis = new Apis()
