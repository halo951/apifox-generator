"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimByLine = void 0;
const trimByLine = (str) => {
    return str
        .split(/\n/g)
        .map((s) => s.trim())
        .join('\n');
};
exports.trimByLine = trimByLine;
