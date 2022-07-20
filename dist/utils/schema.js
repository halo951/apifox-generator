"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendParentInterface = exports.transform = void 0;
const transform = (schema, globalKey, globalHandleType, parent) => {
    for (const key in schema) {
        // add additionalProperties at false
        if (key === 'type' && !parent?.['properties'])
            schema['additionalProperties'] = false;
        if (key === 'properties') {
            for (const k in schema['properties']) {
                const prop = schema['properties'][k];
                // remove global key
                if (!parent && globalKey.includes(k)) {
                    if (globalHandleType === 'delete') {
                        delete schema['properties'][k];
                    }
                    else {
                        prop['description'] = '(全局变量) ' + (prop['description'] || '[缺少注释]');
                        schema['required'] = schema['required'].filter((key) => key !== k);
                    }
                }
                // title to description
                if (prop.title) {
                    if (prop.description) {
                        prop.description = prop.title + ' | ' + prop.description;
                    }
                    else {
                        prop.description = prop.title;
                    }
                    delete prop.title;
                }
            }
        }
        // deep object
        if (typeof schema[key] === 'object')
            (0, exports.transform)(schema[key], globalKey, globalHandleType, schema);
    }
};
exports.transform = transform;
/** 添加接口继承的父类 */
const appendParentInterface = (schame, parentInterface) => {
    if (parentInterface) {
        schame['extends'] = {
            title: parentInterface,
            type: 'any'
        };
    }
};
exports.appendParentInterface = appendParentInterface;
