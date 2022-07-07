"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSelect = exports.inputMultiSelect = exports.inputConfirm = exports.inputText = void 0;
const prompts_1 = __importDefault(require("prompts"));
const inputText = async (message) => {
    const { value } = await (0, prompts_1.default)({
        name: 'value',
        message,
        type: 'text'
    });
    return value;
};
exports.inputText = inputText;
const inputConfirm = async (message) => {
    const { value } = await (0, prompts_1.default)({
        name: 'value',
        type: 'confirm',
        message
    });
    return value;
};
exports.inputConfirm = inputConfirm;
const inputMultiSelect = async (message, choices) => {
    const { list } = await (0, prompts_1.default)({
        type: 'multiselect',
        name: 'list',
        message,
        choices
    });
    return list;
};
exports.inputMultiSelect = inputMultiSelect;
const inputSelect = async (message, choices) => {
    const { item } = await (0, prompts_1.default)({
        type: 'select',
        name: 'item',
        message,
        choices
    });
    return item;
};
exports.inputSelect = inputSelect;
