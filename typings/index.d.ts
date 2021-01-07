export interface options { 
    target?: string; 
}
export type allData = { 
    ID: string; 
    data: any; 
}[];
export declare const version: string;
export declare const fetch: (key: string, options?: options) => any | null;
export declare const get: (key: string, options?: options) => any | null;
export declare const set: (key: string, value: any, options?: options) => any;
export declare const add: (key: string, value: number, options?: options) => number;
export declare const subtract: (key: string, value: number, options?: options) => number;
export declare const push: (key: string, value: any, options?: options) => any[];
export declare const del: (key: string, value: any, options?: options) => boolean;
export declare const has: (key: string, options?: options) => boolean;
export declare const includes: (key: string, options?: options) => boolean;
export declare const all: (options?: options) => allData;
export declare const fetchAll: (options?: options) => allData;
export declare const type: (key: string, options?: options) => string;
export declare class table {
    constructor(tableName: string, options?: options);
    fetch: (key: string, options?: options) => any | null;
    get: (key: string, options?: options) => any | null;
    set: (key: string, value: any, options?: options) => any;
    add: (key: string, value: number, options?: options) => number;
    subtract: (key: string, value: number, options?: options) => number;
    push: (key: string, value: any, options?: options) => any[];
    del: (key: string, value: any, options?: options) => boolean;
    has: (key: string, options?: options) => boolean;
    includes: (key: string, options?: options) => boolean;
    all: (options?: options) => allData;
    fetchAll: (options?: options) => allData;
}
