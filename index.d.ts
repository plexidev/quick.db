/**
 * Definitions by: Zoro <admin@zoro.tech>
 */

declare module 'quick.db' {

    /**
     * This function fetches data from a key in the database. (alias: .get())
     * @param {key} input any string as a key. Also allows for dot notation following the key.
     * @param {options} [input={ target: null }] Any options to be added to the request.
     * @returns {data} the data requested.
     */
    function fetch(key: string, ops?: object): any;
    function get(key: string, ops?: object): any;



    /**
     * This function sets new data based on a key in the database. 
     * @param {key} input any string as a key. Also allows for dot notation following the key.
     * @param {options} [input={ target: null }] Any options to be added to the request.
     * @returns {data} the updated data.
     */
    function set(key: string, value: string|object|Array<any>, ops?: object): any;

    /**
     * This function adds a number to a key in the database. (If no existing number, it will add to 0)
     * @param {key} input any string as a key. Also allows for dot notation following the key.
     * @param {options} [input={ target: null }] Any options to be added to the request.
     * @returns {data} the updated data.
     */
    function add(key: string, value: number, ops?: object): any;

    /**
     * This function subtracts a number to a key in the database. (If no existing number, it will subtract from 0)
     * @param {key} input any string as a key. Also allows for dot notation following the key.
     * @param {options} [input={ target: null }] Any options to be added to the request.
     * @returns {data} the updated data.
     */
    function subtract(key: string, value: number, ops?: object): any;

    /**
     * This function will push into an array in the database based on the key. (If no existing array, it will create one)
     * @param {key} input any string as a key. Also allows for dot notation following the key.
     * @param {options} [input={ target: null }] Any options to be added to the request.
     * @returns {data} the updated data.
     */
    function push(key: string, value: string|object|Array<any>): Array<any>;

    /**
     * This function returns a boolean indicating whether an element with the specified key exists or not.
     * @param {key} input any string as a key. Also allows for dot notation following the key, this will return if the prop exists or not.
     * @param {options} [input={ target: null }] Any options to be added to the request.
     * @returns {boolean} if it exists.
     */
    function has(key: string, ops?: object): boolean;
    function includes(key: string, ops?: object): boolean;

    /**
     * This function fetches the entire active table
     * @param {options} [input={ target: null }] Any options to be added to the request.
     * @returns {boolean} if it exists.
     */
    function all(ops?: object): { ID: any; data: any; }[];
    function fetchAll(ops?: object): boolean;
    
    function table(tableName: string, options: any): any
    
    /**
     * This function will delete an object (or property) in the database.
     * @param {key} input any string as a key. Also allows for dot notation following the key, this will delete the prop in the object.
     * @param {options} [input={ target: null }] Any options to be added to the request.
     * @returns {boolean} if it was a success or not.
     */
    function del(key: string, ops?:object): boolean;

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
