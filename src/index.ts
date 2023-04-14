import { set, get, unset } from "lodash";
import { IDriver } from "./interfaces/IDriver";
import { isConnectable, isDisconnectable } from "./utilities";
import { CustomError as QuickError, ErrorKind } from "./error";

export { IDriver } from "./interfaces/IDriver";
export { IRemoteDriver } from "./interfaces/IRemoteDriver";

/**
 * Options for the QuickDB class
 */
export interface IQuickDBOptions {
    /**
     * The table name to use
     * @default json
     */
    table?: string;

    /**
     * The file path to use
     * @default json.sqlite
     */
    filePath?: string;

    /**
     * The driver to use
     * @default SqliteDriver
     **/
    driver?: IDriver;

    /**
     * If the keys should be treated as normal keys
     * @default false
     **/
    normalKeys?: boolean;
}

/**
 * The main class for QuickDB
 * @example
 * ```ts
 * const db = new QuickDB();
 * await db.init(); // Always needed!!!
 * await db.set("test", "Hello World");
 * console.log(await db.get("test"));
 * ```
 */
export class QuickDB<D = any> {
    private static instance?: QuickDB;
    private _driver: IDriver;
    private tableName: string;
    private normalKeys: boolean;
    private options: IQuickDBOptions;

    /**
     * The driver used by QuickDB
     * @example
     * ```ts
     * const db = new QuickDB();
     * await db.init();
     * console.log(db.driver);
     * ```
     * @readonly
     **/
    get driver(): IDriver {
        return this._driver;
    }

    constructor(options: IQuickDBOptions = {}) {
        options.table ??= "json";
        options.filePath ??= "json.sqlite";
        options.normalKeys ??= false;
        if (!options.driver) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { SqliteDriver } = require("./drivers/SqliteDriver");
            options.driver = SqliteDriver.createSingleton(options.filePath);
        }

        this.options = options;
        this._driver = options.driver!;
        this.tableName = options.table;
        this.normalKeys = options.normalKeys;
    }

    private async addSubtract(
        key: string,
        value: number,
        sub = false
    ): Promise<number> {
        if (typeof key != "string") {
            throw new QuickError(
                `First argument (key) needs to be a string received "${typeof key}"`,
                ErrorKind.InvalidType
            );
        }

        if (value == null) {
            throw new QuickError(
                "Missing second argument (value)",
                ErrorKind.MissingValue
            );
        }

        let currentNumber = await this.get<number>(key);

        if (currentNumber == null) currentNumber = 0;
        if (typeof currentNumber != "number") {
            try {
                currentNumber = parseFloat(currentNumber as string);
            } catch (_) {
                throw new QuickError(
                    `Current value with key: (${key}) is not a number and couldn't be parsed to a number`,
                    ErrorKind.InvalidType
                );
            }
        }

        if (typeof value != "number") {
            try {
                value = parseFloat(value as string);
            } catch (_) {
                throw new QuickError(
                    `Value to add/subtract with key: (${key}) is not a number and couldn't be parsed to a number`,
                    ErrorKind.InvalidType
                );
            }
        }

        sub ? (currentNumber -= value) : (currentNumber += value);
        await this.set<number>(key, currentNumber);
        return currentNumber;
    }

    private async getArray<T = D>(key: string): Promise<T[]> {
        const currentArr = (await this.get<T[]>(key)) ?? [];

        if (!Array.isArray(currentArr)) {
            throw new QuickError(
                `Current value with key: (${key}) is not an array`,
                ErrorKind.InvalidType
            );
        }

        return currentArr;
    }

    /**
     * Set a singleton instance of QuickDB
     * @example
     * ```ts
     * const db = QuickDB.getSingletion();
     * await db.init();
     * ```
     **/
    static setSingleton<T>(options: IQuickDBOptions = {}): QuickDB<T> {
        this.instance = new QuickDB(options);
        return this.instance;
    }

    /**
     * Get the singleton instance of QuickDB
     * @example
     * ```ts
     * // If you have set a singleton instance
     * // Otherwise it will return undefined
     * const db = QuickDB.getSingletion();
     * await db.init();
     * ```
     **/
    static getSingletion<T>(): QuickDB<T> | undefined {
        return this.instance;
    }

    /**
     * Initialize the database
     * @example
     * ```ts
     * const db = new QuickDB();
     * await db.init();
     * ```
     **/
    async init(): Promise<void> {
        if (isConnectable(this.driver)) {
            await this.driver.connect();
        }
        await this.driver.prepare(this.tableName);
    }

    /**
     * Closes the connection to the database
     * @example
     * ```ts
     *  const db = new QuickDB();
     * await db.init();
     * await db.close();
     * ```
     **/
    async close(): Promise<void> {
        if (isDisconnectable(this.driver)) {
            await this.driver.disconnect();
        }
    }

    /**
     * Return all the elements in the database
     * @example
     * ```ts
     * const db = new QuickDB();
     * await db.init();
     * await db.set("test", "Hello World");
     * console.log(await db.all());
     * ```
     **/
    async all<T = D>(): Promise<{ id: string; value: T }[]> {
        return this.driver.getAllRows(this.tableName);
    }

    /**
     * Get a value from the database
     * @example
     * ```ts
     * const db = new QuickDB();
     * await db.init();
     * await db.set("test", "Hello World");
     * console.log(await db.get("test"));
     * ```
     **/
    async get<T = D>(key: string): Promise<T | null> {
        if (typeof key != "string") {
            throw new QuickError(
                `First argument (key) needs to be a string received "${typeof key}"`,
                ErrorKind.InvalidType
            );
        }

        if (key.includes(".") && !this.normalKeys) {
            const keySplit = key.split(".");
            const [result] = await this.driver.getRowByKey<T>(
                this.tableName,
                keySplit[0]
            );
            return get(result, keySplit.slice(1).join("."));
        }

        const [result] = await this.driver.getRowByKey<T>(this.tableName, key);
        return result;
    }

    /**
     * Set a value in the database
     * @example
     * ```ts
     * const db = new QuickDB();
     * await db.init();
     * await db.set("test", "Hello World");
     * ```
     **/
    async set<T = D>(key: string, value: T): Promise<T> {
        if (typeof key != "string") {
            throw new QuickError(
                `First argument (key) needs to be a string received "${typeof key}"`,
                ErrorKind.InvalidType
            );
        }

        if (value == null) {
            throw new QuickError(
                "Missing second argument (value)",
                ErrorKind.MissingValue
            );
        }

        if (key.includes(".") && !this.normalKeys) {
            const keySplit = key.split(".");
            const [result, exist] = await this.driver.getRowByKey(
                this.tableName,
                keySplit[0]
            );
            // If it's not an instance of an object (rewrite it)
            let obj: object;
            if (result instanceof Object == false) {
                obj = {};
            } else {
                obj = result as object;
            }

            const valueSet = set<T>(
                obj ?? {},
                keySplit.slice(1).join("."),
                value
            );
            return this.driver.setRowByKey(
                this.tableName,
                keySplit[0],
                valueSet,
                exist
            );
        }

        const exist = (await this.driver.getRowByKey(this.tableName, key))[1];
        return this.driver.setRowByKey(this.tableName, key, value, exist);
    }

    /**
     * Check if a key exists in the database
     * @example
     * ```ts
     * const db = new QuickDB();
     * await db.init();
     * await db.set("test", "Hello World");
     * console.log(await db.has("test"));
     * ```
     **/
    async has(key: string): Promise<boolean> {
        return (await this.get(key)) != null;
    }

    /**
     * Delete a key from the database
     * @example
     * ```ts
     * const db = new QuickDB();
     * await db.init();
     * await db.set("test", "Hello World");
     * await db.delete("test");
     * ```
     **/
    async delete(key: string): Promise<number> {
        if (typeof key != "string") {
            throw new QuickError(
                `First argument (key) needs to be a string received "${typeof key}"`,
                ErrorKind.InvalidType
            );
        }

        if (key.includes(".")) {
            const keySplit = key.split(".");
            const obj = (await this.get<any>(keySplit[0])) ?? {};
            unset(obj, keySplit.slice(1).join("."));
            return this.set(keySplit[0], obj);
        }

        return this.driver.deleteRowByKey(this.tableName, key);
    }

    /**
     * Delete all the keys from the database
     * @example
     * ```ts
     * const db = new QuickDB();
     * await db.init();
     * await db.set("test", "Hello World");
     * await db.deleteAll();
     * ```
     **/
    async deleteAll(): Promise<number> {
        return this.driver.deleteAllRows(this.tableName);
    }

    /**
     * Add a number to a key
     * @example
     * ```ts
     * const db = new QuickDB();
     * await db.init();
     * await db.set("test", 10);
     * await db.add("test", 5);
     * console.log(await db.get("test"));
     * ```
     **/
    async add(key: string, value: number): Promise<number> {
        return this.addSubtract(key, value);
    }

    /**
     * Subtract a number from a key
     * @example
     * ```ts
     * const db = new QuickDB();
     * await db.init();
     * await db.set("test", 10);
     * await db.sub("test", 5);
     * console.log(await db.get("test"));
     * ```
     **/
    async sub(key: string, value: number): Promise<number> {
        return this.addSubtract(key, value, true);
    }

    /**
     * Push a value to an array
     * @example
     * ```ts
     * const db = new QuickDB();
     * await db.init();
     * await db.set("test", []);
     * await db.push("test", "Hello World");
     * console.log(await db.get("test"));
     * ```
     **/
    async push<T = D>(key: string, value: T): Promise<T[]> {
        if (typeof key != "string") {
            throw new QuickError(
                `First argument (key) needs to be a string received "${typeof key}"`,
                ErrorKind.InvalidType
            );
        }

        if (value == null) {
            throw new QuickError(
                "Missing second argument (value)",
                ErrorKind.MissingValue
            );
        }

        const currentArr = await this.getArray<T>(key);
        currentArr.push(value);

        return this.set(key, currentArr);
    }

    /**
     * Unshift a value from an array
     * @example
     * ```ts
     * const db = new QuickDB();
     * await db.init();
     * await db.set("test", []);
     * await db.unshift("test", "Hello World");
     * console.log(await db.get("test"));
     * ```
     **/
    async unshift<T = D>(key: string, value: T | T[]): Promise<T[]> {
        if (typeof key != "string") {
            throw new QuickError(
                `First argument (key) needs to be a string received "${typeof key}"`,
                ErrorKind.InvalidType
            );
        }
        if (value == null) {
            throw new QuickError(
                "Missing second argument (value)",
                ErrorKind.InvalidType
            );
        }

        let currentArr = await this.getArray<T>(key);
        if (Array.isArray(value)) currentArr = value.concat(currentArr);
        else currentArr.unshift(value);

        return this.set(key, currentArr);
    }

    /**
     * Pop a value from an array
     * @example
     * ```ts
     * const db = new QuickDB();
     * await db.init();
     * await db.set("test", ["Hello World"]);
     * console.log(await db.pop("test"));
     * ```
     **/
    async pop<T = D>(key: string): Promise<T | undefined> {
        if (typeof key != "string") {
            throw new QuickError(
                `First argument (key) needs to be a string received "${typeof key}"`,
                ErrorKind.InvalidType
            );
        }

        const currentArr = await this.getArray<T>(key);
        const value = currentArr.pop();

        this.set(key, currentArr);

        return value;
    }

    /**
     * Shift a value from an array
     * @example
     * ```ts
     * const db = new QuickDB();
     * await db.init();
     * await db.set("test", ["Hello World"]);
     * console.log(await db.shift("test"));
     * ```
     **/
    async shift<T = D>(key: string): Promise<T | undefined> {
        if (typeof key != "string") {
            throw new QuickError(
                `First argument (key) needs to be a string received "${typeof key}"`,
                ErrorKind.InvalidType
            );
        }

        const currentArr = await this.getArray<T>(key);
        const value = currentArr.shift();

        this.set(key, currentArr);

        return value;
    }

    /**
     * Pull a value from an array
     * @example
     * ```ts
     * const db = new QuickDB();
     * await db.init();
     * await db.set("test", ["Hello World"]);
     * console.log(await db.pull("test", "Hello World"));
     * ```
     **/
    async pull<T = D>(
        key: string,
        value: T | T[] | ((data: T, index: string) => boolean),
        once = false
    ): Promise<T[]> {
        if (typeof key != "string") {
            throw new QuickError(
                `First argument (key) needs to be a string received "${typeof key}"`,
                ErrorKind.InvalidType
            );
        }
        if (value == null) {
            throw new QuickError(
                "Missing second argument (value)",
                ErrorKind.MissingValue
            );
        }

        const currentArr = await this.getArray<T>(key);
        if (!Array.isArray(value) && typeof value != "function")
            value = [value];

        const data = [];
        for (const i in currentArr) {
            if (
                Array.isArray(value)
                    ? value.includes(currentArr[i])
                    : (value as any)(currentArr[i], i)
            )
                continue;
            data.push(currentArr[i]);
            if (once) break;
        }

        return this.set(key, data);
    }

    /**
     * Get all keys that start with the string
     * @example
     * ```ts
     * const db = new QuickDB();
     * await db.init();
     * await db.set("test", "Hello World");
     * await db.set("test2", "Hello World");
     * console.log(await db.startsWith("test"));
     * ```
     **/
    async startsWith<T = D>(
        query: string,
        key = ""
    ): Promise<{ id: string; value: T }[]> {
        if (typeof query != "string") {
            throw new QuickError(
                `First argument (query) needs to be a string received "${typeof query}"`,
                ErrorKind.InvalidType
            );
        }
        if (typeof key != "string") {
            throw new QuickError(
                `Second argument (key) needs to be a string received "${typeof key}"`,
                ErrorKind.InvalidType
            );
        }

        // Get either the whole db or the rows from the provided key
        // -> Filter the result if the id starts with the provided query
        // -> Return the filtered result
        return (
            (key === "" ? await this.all() : (await this.get(key)) ?? []) as {
                id: string;
                value: T;
            }[]
        ).filter((v) => v.id.startsWith(query));
    }

    /**
     * Change the table
     * @example
     * ```ts
     * const db = new QuickDB();
     * await db.init();
     * const table = await db.table("test");
     * await table.set("test", "Hello World");
     * console.log(await table.get("test"));
     * ```
     **/
    async table<T = D>(table: string): Promise<QuickDB<T>> {
        if (typeof table != "string") {
            throw new QuickError(
                `First argument (table) needs to be a string received "${typeof table}"`,
                ErrorKind.InvalidType
            );
        }

        const options = { ...this.options };
        options.table = table;
        options.driver = this.driver;
        const instance = new QuickDB(options);
        await instance.init();

        return instance;
    }

    /**
     * Use normal keys
     * @example
     * ```ts
     * const db = new QuickDB();
     * await db.init();
     * await db.set("test.nice", "Hello World");
     * console.log(await db.get("test"));
     * await db.useNormalKeys(true);
     * await db.set("test.nice", "Hello World");
     * console.log(await db.get("test"));
     * ```
     **/
    useNormalKeys(activate: boolean): void {
        this.normalKeys = activate;
    }
}
