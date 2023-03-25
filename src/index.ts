import { set, get, unset } from "lodash";
import { IDriver } from "./drivers/IDriver";
import { SqliteDriver } from "./drivers/SqliteDriver";

export { IDriver } from "./drivers/IDriver";
export { MongoDriver, CollectionInterface } from "./drivers/MongoDriver";
export { SqliteDriver } from "./drivers/SqliteDriver";
export { MySQLDriver, Config } from "./drivers/MySQLDriver";
export { MemoryDriver } from "./drivers/MemoryDriver";
export { JSONDriver } from "./drivers/JSONDriver";

export interface IQuickDBOptions {
    table?: string;
    filePath?: string;
    driver?: IDriver;
    normalKeys?: boolean;
}

export class QuickDB<D = any> {
    private static instance: QuickDB;
    private prepared!: Promise<unknown>;
    private _driver: IDriver;
    private tableName: string;
    private normalKeys: boolean;
    private options: IQuickDBOptions;

    get driver(): IDriver {
        return this._driver;
    }

    constructor(options: IQuickDBOptions = {}) {
        options.table ??= "json";
        options.filePath ??= "json.sqlite";
        options.driver ??= SqliteDriver.createSingleton(options.filePath);
        options.normalKeys ??= false;

        this.options = options;
        this._driver = options.driver;
        this.tableName = options.table;
        this.normalKeys = options.normalKeys;

        this.prepared = this.driver.prepare(this.tableName);
    }

    private async addSubtract(
        key: string,
        value: number,
        sub = false
    ): Promise<number> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");

        if (value == null) throw new Error("Missing second argument (value)");

        let currentNumber = await this.get<number>(key);

        if (currentNumber == null) currentNumber = 0;
        if (typeof currentNumber != "number") {
            try {
                currentNumber = parseFloat(currentNumber as string);
            } catch (_) {
                throw new Error(
                    `Current value with key: (${key}) is not a number and couldn't be parsed to a number`
                );
            }
        }

        if (typeof value != "number") {
            try {
                value = parseFloat(value as string);
            } catch (_) {
                throw new Error(
                    `Value to add/subtract with key: (${key}) is not a number and couldn't be parsed to a number`
                );
            }
        }

        sub ? (currentNumber -= value) : (currentNumber += value);
        await this.set<number>(key, currentNumber);
        return currentNumber;
    }

    private async getArray<T = D>(key: string): Promise<T[]> {
        const currentArr = (await this.get<T[]>(key)) ?? [];

        if (!Array.isArray(currentArr))
            throw new Error(`Current value with key: (${key}) is not an array`);

        return currentArr;
    }

    static createSingleton<T>(options: IQuickDBOptions = {}): QuickDB<T> {
        if (!this.instance) this.instance = new QuickDB(options);
        return this.instance;
    }

    async all<T = D>(): Promise<{ id: string; value: T }[]> {
        return this.driver.getAllRows(this.tableName);
    }

    async get<T = D>(key: string): Promise<T | null> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");

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

    async set<T = D>(key: string, value: T): Promise<T> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");
        if (value == null) throw new Error("Missing second argument (value)");

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

    async has(key: string): Promise<boolean> {
        return (await this.get(key)) != null;
    }

    async delete(key: string): Promise<number> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");

        if (key.includes(".")) {
            const keySplit = key.split(".");
            const obj = (await this.get<any>(keySplit[0])) ?? {};
            unset(obj, keySplit.slice(1).join("."));
            return this.set(keySplit[0], obj);
        }

        return this.driver.deleteRowByKey(this.tableName, key);
    }

    async deleteAll(): Promise<number> {
        return this.driver.deleteAllRows(this.tableName);
    }

    async add(key: string, value: number): Promise<number> {
        return this.addSubtract(key, value);
    }

    async sub(key: string, value: number): Promise<number> {
        return this.addSubtract(key, value, true);
    }

    async push<T = D>(key: string, value: T): Promise<T[]> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");
        if (value == null) throw new Error("Missing second argument (value)");

        const currentArr = await this.getArray<T>(key);
        currentArr.push(value);

        return this.set(key, currentArr);
    }

    async unshift<T = D>(key: string, value: T | T[]): Promise<T[]> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");
        if (value == null) throw new Error("Missing second argument (value)");

        let currentArr = await this.getArray<T>(key);
        if (Array.isArray(value)) currentArr = value.concat(currentArr);
        else currentArr.unshift(value);

        return this.set(key, currentArr);
    }

    async pop<T = D>(key: string): Promise<T | undefined> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");

        const currentArr = await this.getArray<T>(key);
        const value = currentArr.pop();

        this.set(key, currentArr);

        return value;
    }

    async shift<T = D>(key: string): Promise<T | undefined> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");

        const currentArr = await this.getArray<T>(key);
        const value = currentArr.shift();

        this.set(key, currentArr);

        return value;
    }

    async pull<T = D>(
        key: string,
        value: T | T[] | ((data: T, index: string) => boolean),
        once = false
    ): Promise<T[]> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");
        if (value == null) throw new Error("Missing second argument (value)");

        const currentArr = await this.getArray<T>(key);
        if (!Array.isArray(value) && typeof value != "function")
            value = [value];

        const data = [];
        for (const i in currentArr) {
            if (Array.isArray(value) ? value.includes(currentArr[i])
                : (value as any)(currentArr[i], i))
                continue;
            data.push(currentArr[i]);
            if (once) break;
        }

        return this.set(key, data);
    }

    async startsWith<T = D>(
        query: string,
        key = ""
    ): Promise<{ id: string; value: T }[]> {
        if (typeof query != "string")
            throw new Error("First argument (query) needs to be a string");
        if (typeof key != "string")
            throw new Error("Second argument (key) needs to be a string");

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

    table<T = D>(table: string): QuickDB<T> {
        if (typeof table != "string")
            throw new Error("First argument (table) needs to be a string");

        const options = { ...this.options };

        options.table = table;
        options.driver = this.driver;
        return new QuickDB(options);
    }

    // Here for temporary backwards compatibility fix
    async tableAsync(table: string): Promise<QuickDB> {
        const db = this.table(table);
        await db.prepared;

        return db;
    }

    useNormalKeys(activate: boolean): void {
        this.normalKeys = activate;
    }
}
