"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist_1 = __importDefault(require("minimist"));
const config_1 = require("./config");
const input_1 = require("./utils/input");
const generator_1 = require("./generator");
/** Api 映射文件 生成器 */
class ApifoxGenerator {
    /** 配置读取 */
    configLoader = new config_1.ConfigLoader();
    /** 生成器 */
    generator = new generator_1.Generator();
    async exec() {
        const { q: quick, m: mock } = (0, minimist_1.default)(process.argv);
        console.log('> 读取配置...');
        const { config, treeNode, details } = await this.configLoader.exec();
        // 提示确认配置项, 配置项有误则
        if (!quick) {
            this.point(config);
            console.log('> 请确认生成配置, 下一步将生成 apis 文件,.', '\n> 如配置有误, 需要取消, 并修改配置文件选项');
            const confirmed = await (0, input_1.inputConfirm)('是否采用上述配置生成:');
            if (!confirmed)
                return console.log('> 已取消');
        }
        // 执行生成过程.
        this.generator.exec(config, treeNode, details, mock);
    }
    point(config) {
        const out = JSON.parse(JSON.stringify(config));
        delete out.Authorization;
        delete out.floders;
        out.requestTemplate = out.requestTemplate.name;
        out.usage = out.usage.map((u) => ({ name: u.name, mapFile: u.mapFile }));
        console.log('-------------------------');
        console.log(JSON.stringify(out, null, 4));
        console.log('-------------------------');
    }
}
exports.default = ApifoxGenerator;
