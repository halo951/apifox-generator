```
.
|- lib2/
    |- index.ts
    |- utils/  --------------------- 公共工具
    |- intf/  ---------------------- 公共接口
        |- IConfig.ts -------------- 接口生成器配置接口
        |- IDataSource.ts ---------- 生成器操作数据源接口
    |- scripts/ -------------------- 工具集
    |- config/  -------------------- 配置入口
        |- index.ts
        |- intf/
            |- ...
        |- v1.ts ------------------- 是否包含v1.x版本配置, 包含了增加转化逻辑
        |- base.ts ----------------- 基础信息导入
        |- template.ts ------------- 模板配置
        |- datasource/ ----------- 数据源配置
            |- apifox/
                |- 输入账号密码登录
                |- 选择账号下[团队-项目]
                |- 选择哪些接口参与生成
    |- loader/
        |- index.ts
        |- intf/ ------------------- loader 接口
            |- IOrigin.ts ---------- (原始数据源)
            |- IOriginApifox.ts ---- apifox数据源
            |- ...
        |- adapter ----------------- 数据加载器
            |- apifox.ts ----------- apifox 数据源导入
            |- apipost.ts ---------- apipost 数据源导入
        |- transformer
            |- index.ts
            |- pipe/ --------------- 链式处理原始数据源
                |- name.ts --------- 生成接口方法名
                |- query.ts -------- 生成查询条件
                |- response.ts ----- 生成响应条件
                |- check-dup..-name- 重复性校验
    |- generator/  ----------------- 生成器
        |- index.ts
            |- 1. 根据datasource生成的module数据源, 创建ts的AST语法树
            |- 2. 通过editor将语法树转化为files list
            |- 3.
        |- utils/
            |- create-ts-ast.ts ------- ast语法编辑器 (ast 创建/读取/转化)
        |- ast
            |- generate-index.ts --- 生成 index.ts 语法树
            |- generate-module.ts -- 生成 modules.ts 语法树
        |- out/
            |- out2ts.ts
            |- out2js.ts

```
