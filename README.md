# apifox 接口生成器

> [TIPS] 
<p style='color:red; font-weight: bold; font-size: 24px;'>这个 package 废弃了, 请跳转到新的包 <a href='https://www.npmjs.com/package/api-refs'>api-refs</a> </p>

## about

> 这是一个能够显著提高前端开发效率的工具。基于 apifox 的 JSONSchema 规范, 生成前端项目使用的接口调用文件.

-   **便捷** 仅需执行一条命令, 即可生成项目内使用的 api 调用文件
-   **实时** 每次生成时, 将校验 apifox 文档中资源是否发生变化, 发生变化时将通知配置变更逻辑
-   **产物**

    -   ts 项目: `*.ts`
    -   js 项目: `*.js`, `*.d.ts` (需要借助 vscode 提供类型推断能力)

-   **规则** 参考下方 [QA 解答](#QA)

## Usage

-   install

```bash

yarn global add apifox-generator

```

-   generate

```bash

api-gen

```

## argv

-   `--reset [config name]` 重新设置某项配置参数, 示例: `--reset js,projectId`
-   `--init` 仅初始化文档

## 模板参数

```

## 模板参数说明

| 参数模板        | 配置项                | 描述                                                    |
| --------------- | --------------------- | ------------------------------------------------------- |
| `[requestUtil]` | template.importSyntax | 请求工具                                                |
| `[utilPath]`    | template.importSyntax | 请求工具文件地址, 默认使用 `@/utils/request`            |
| `[group-path]`  | template.header       | 当前组的上级文件夹名称 (在存在同名分组时, 可能有些用处) |
| `[group-name]`  | template.header       | 组名 (apifox 文件夹名称)                                |
| `[file-name]`   | template.header       | 文件名                                                  |
| `[apifox-url]`  | template.header       | 当前项目在 apifox 上的文件地址                          |
| `[api-size]`    | template.header       | 当前文件夹下生成的接口数量                              |

> 其他参数项, 请参考: [IConfig.ts](https://github.com/halo951/apifox-generator/tree/master/lib/intf//IConfig.ts)

## QA

### 1. 配置修改问题总结

-   配置文件可以在`apifox.rule.json`修改
-   如果删除了一条配置, 那么下次生成时, 会提示重新输入
-   不要担心配置错了, 如果不能确定模板配置是否配置正确, 那么建议执行下生成看下生成结果是否符合预期, 不符合修改配置模板即可.

### 2. 当 apifox 目录发生改变时

apifox 目录发生改变(增加, 删除, 名称变化, 目录移动)等情况, 会在下次生成时, 提示目录变化需重新选择

注意, 配置关注的是目录节点, api 节点不在变化检查范围内.

### 3. 项目里面如何更好的使用生成器

1.  建议每次生成前, 将现有代码进行提交(git add . && git commit). 然后, 生成后, 可根据 git 变更行内容, 来确认接口文档是否发生改变.
2.  建议使用 ts 项目, 并开启严格模式, 当接口参数发生变化时, 将产生问题提示.

### 4. 对于目录合并问题的解答

通常情况下, 我们建议 2 条规则.

-   目录不应该与接口处在同级目录内
-   根目录下不要放置接口

遵循以上 2 条原则, 当出现子目录场景时, 当子目录全部被选中情况下, 将提示是否将这些子目录下接口合并到同一文件内. 否则(包含, 目录未全选情况)将逐个生成文件.
```

## Road Map

1. 使用 Ast 语法树方式重写生成器逻辑, 现阶段文本替换方式局限性太大
2. loader重构, 修改为适配器模式, 增加多平台支持 (如: apipost)
