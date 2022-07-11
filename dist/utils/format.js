"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNameSuffixByDuplicate = exports.formatInterfaceName = exports.formatToHump = void 0;
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
const formatNameSuffixByDuplicate = (name, duplicate) => {
    if (!duplicate[name]) {
        duplicate[name] = 1;
    }
    else {
        duplicate[name]++;
    }
    name += duplicate[name] === 1 ? '' : duplicate[name] - 1;
    return name;
};
exports.formatNameSuffixByDuplicate = formatNameSuffixByDuplicate;
