declare module 'quick.db' {

    function fetch(key: string, ops?: object): any;
    function get(key: string, ops?: object): any;

    function set(key: string, value: string|object|Array<any>, ops?: object): any;

    function add(key: string, value: number, ops?: object): any;
    function subtract(key: string, value: number, ops?: object): any;

    function push(key: string, value: string|object|Array<any>): Array<any>;

    function has(key: string, ops?: object): boolean;
    function includes(key: string, ops?: object): boolean;

    function all(ops?: object): boolean;
    function fetchAll(ops?: object): boolean;

    function del(key: string, ops?:object): boolean

    export {
        fetch,
        get,
        set,
        add,
        subtract,
        push,
        has,
        includes,
        all,
        fetchAll,
        del as delete
    }

}