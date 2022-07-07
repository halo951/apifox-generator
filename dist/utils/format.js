"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatInterfaceName = exports.formatToHump = void 0;
const formatToHump = (value) => {
    return value.replace(/[\_\-](\w)/g, (_, letter) => letter.toUpperCase());
};
exports.formatToHump = formatToHump;
const formatInterfaceName = (value, suffix) => {
    value = (0, exports.formatToHump)(value);
    value = value.replace(/^([\w])/, (_, $1) => $1.toUpperCase());
    return `I${value}${suffix}`;
};
exports.formatInterfaceName = formatInterfaceName;
