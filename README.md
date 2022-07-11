# persagy - apifox 接口生成工具

> 以 `apifox` 文件夹为单位, 按照文件夹生成接口的 `/apis/*.ts` 请求列表.

## usage

-   install

```bash

yarn global add apifox-generator

```

-   config and first generate

> 执行命令, 并按提示配置内容

```bash

api-gen

```

-   quick generate

```bash

api-gen -q

```

## 配置项说明

-   apifox.rule.json

| 配置项          | 描述                                   | 获取方式                                      |
| --------------- | -------------------------------------- | --------------------------------------------- |
| projectId       | apifox 项目 id                         | 可以从 web 端的 apifox 查看, url 中的最后一段 |
| Authorization   | 鉴权 token                             | 在 `api-gen` 命令中, 登录即可                 |
| outDir          | 输出文件目录(不存在则自动创建)         |                                               |
| folders         | 用于对比 apifox 接口文件夹是否出现变更 | -                                             |
| usage           | 本地配置的用于生成的接口文件夹集合     | -                                             |
| requestTemplate | 生成接口请求的配置模板                 |                                               |

-   requestTemplate

| 配置项               | 描述                                       | 可选/默认值                                           | 备注                                                                           |
| -------------------- | ------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------ | --- |
| name                 | 模板名                                     | 'request util', 'basic axios'                         |                                                                                |
| headerComment        | 文件头部注释                               |                                                       |                                                                                |
| importSyntax         | 请求工具导入语句                           | `import {request, IResponse} from '@/utils/request' ` |                                                                                |
| requestUtil          | 请求工具(使用 axios 或在 axios 基础上扩展) | request / axios                                       | 注意于请求语句对应, 如果使用其他的请求工具, 至少需要具备 `req.post` 等请求方法 |
| responseExtend       | 响应值继承的全局响应接口                   | IResponse                                             | 注意于请求语句对应                                                             |
| globalParamsKey      | 全局参数字段名                             | Array<string>                                         | 一般需要生成后, 二次配置                                                       |
| globalResponseKey    | 全局响应值字段名                           | Array<string>                                         | 一般需要生成后, 二次配置                                                       |
| globalParamsFilter   | 全局参数字段过滤方式                       | 'delete'                                              | 'unrequire'                                                                    |     |
| globalResponseFilter | 全局响应字段过滤方式                       | 'delete'                                              | 'unrequire'                                                                    |     |

## 高阶用法

> api-gen 的配置文件默认存在于项目根目录下 `apifox.rule.json`, 可根据需要修改默认配置字段

1. 配置修改 or 出错, 如何改动

    - 直接修改配置文件
    - 在配置文件中, 删除待修改配置, 并重新运行 `api-gen` 命令即可.

2. 改动生成模板规则

    - 模板支持 `request util` 和 `basic axios` 两种类型, 如果更换类型, 请删除现有配置并重新运行 `api-gen` 命令
    - `name` 属性不要修改, 否则会导致无法按预期模板生成
    - 继承的`IResponse` 接口, 及 request 工具是可以修改的, 但要与`import syntax` 保持一致.
    - 如果存在`全局参数`,`公共响应值结构`, 可以通过`globalParamsKey`,`globalResponseKey` 配置, 然后重新生成即可.

3. 接口文件夹变更

    - 这种情况, 一般不需要考虑, 再次生成时, 将会自动对比本地配置, 如果出现改动, 会提示重新配置 `usage(使用的接口)` 属性.

# thanks: [json-schema-to-typescript](https://www.npmjs.com/package/json-schema-to-typescript)
