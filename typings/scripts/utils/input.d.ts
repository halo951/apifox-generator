export declare const inputText: (message: string) => Promise<any>;
export declare const inputConfirm: (message: string) => Promise<any>;
export declare const inputMultiSelect: <T>(message: string, choices: {
    title: string;
    value: T;
}[]) => Promise<T[]>;
export declare const inputSelect: <T>(message: string, choices: {
    title: string;
    value: T;
}[]) => Promise<T>;
