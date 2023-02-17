# 2023 年 2 月 17 日 16:13:54 - v1.4.x

-   fix: 增加 js 关键字检查, 避免生成的方法名包含 js 关键字导致出错
-   feat: 增加对 restful api 路径参数的支持
    -   支持路径参数解析
        -   参数格式: `${xxx}`, `{xxx}`
        -   可填充到 url 中的任意位置, 但需要注意使用同一种风格
        -   支持格式如下:
            -   `/api/${params}`
            -   `/api/{params}`
            -   `/apis/${params}/get`
-   update: 变更方法名生成方式, 修改为根据 url 前缀采集信息生成
-   chore: 增加 RoadMap, 规划 v2.x 版本设计思路
