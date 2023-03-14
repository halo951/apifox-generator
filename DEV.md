# 下一个大版本架构设计

贡献请遵循 GitFlow 规范

-   功能变更,拉取新分支 `feature/*`
-   修复变更,拉取新分支 `fixure/*`
-

```
.
|-
|- 命令
    |- 默认, -c | 生成接口
    |- -r, --reset | 重新配置
    |- -i, --import | 向项目中导入 request 工具 (默认 axios, @persagy2/request)
    |- -m, --md | 生成 markdown (生成markdown格式的接口信息)
|- ./scripts
    |- import-requet | 导入 import 工具
|- ./config --------- 配置入口
    |- 配置项
        |- 版本号
        |- 生成结果配置
            |- 是否JS
            |- 是否添加 index file
            |- 生成模板 (待定, 或移除, 但应保留)
                |- 变更内容如下:
                |- 1. 引入 IRequst 工具接口
                |- 2. 提供import路径规则, 但提示用户命名需使用 `request`
                |- 3. 移除全局参数接口
                |- 4. 移除全局响应接口
                |- 5. 移除自定义comment配置
        |- 数据源配置
            |- 接口平台
            |- 数据源配置
                |- apifox (token, projectId, folders, usage, mapfile)
                |- apipost (待定)
            |- 生成源目录配置 (增加根目录配置)
|- ./loader --------------------------- 数据加载器
    |- index -------- loader 入口(从不同源加载JSONSchema)
        |-
    |- /adapter ----- 适配器
        |- apifox
        |- apipost
    |- /transformer - 原始数据转换
        |- 生成接口方法名
        |- 生成有哪些参数
        |- 生成有哪些方法
        |- 处理重名/js关键字占用/路径规划问题
|- ./generator ------------------------ 接口生成器
    |- gen index ast --------------- 生成index的 ast语法树 (也可能是 JSONSchema)
    |- gen module ast -------------- 生成 各个模块的 ast 语法树 (也可能是 JSONSchema)
        |- 生成导入语句
        |- 单个方法生成, 包含如下内容
            |- 方法名
            |- 请求路径
            |- 请求参数
            |- 响应参数
            |- path params (url路径参数)
            |- 考虑是否支持 params
        |- write to ast
    |- ast to (tj)s ------------------- 将储存的 ast 语法树转化为实际代码
        |- convert
        |- format
        |- write
```
