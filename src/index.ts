import { set, get, unset } from "lodash";
import { IDriver } from "./interfaces/IDriver";
import { SqliteDriver } from "./drivers/SqliteDriver";
import { isConnectable, isDisconnectable } from "./utilities";
import { CustomError as QuickError, ErrorKind } from "./error";

export { IDriver } from "./interfaces/IDriver";
export { IRemoteDriver } from "./interfaces/IRemoteDriver";
export { MongoDriver, CollectionInterface } from "./drivers/MongoDriver";
export { SqliteDriver } from "./drivers/SqliteDriver";
export { MySQLDriver, Config } from "./drivers/MySQLDriver";
export { MemoryDriver, Table } from "./drivers/MemoryDriver";
export { JSONDriver, DataLike } from "./drivers/JSONDriver";
export { DriverUnion } from "./drivers/DriverUnion";

export { IPipeline } from "./interfaces/pipeline/IPipeline";
export { PipeLiner } from "./interfaces/pipeline/pipeliner";
export { CryptPipeline } from "./interfaces/pipeline/crypto/crypt"

export interface IQuickDBOptions {
    table?: string;
    filePath?: string;
    driver?: IDriver;
    normalKeys?: boolean;
}

export class QuickDB<D = any> {
    private static instance: QuickDB;
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

    static setSingleton<T>(options: IQuickDBOptions = {}): QuickDB<T> {
        this.instance = new QuickDB(options);
        return this.instance;
    }

    static getSingletion<T>(): QuickDB<T> {
        return this.instance;
    }

    async init(): Promise<void> {
        if (isConnectable(this.driver)) {
            await this.driver.connect();
        }
        await this.driver.prepare(this.tableName);
    }

    async close(): Promise<void> {
        if (isDisconnectable(this.driver)) {
            await this.driver.disconnect();
        }
    }

    async all<T = D>(): Promise<{ id: string; value: T }[]> {
        return this.driver.getAllRows(this.tableName);
    }

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

    async has(key: string): Promise<boolean> {
        return (await this.get(key)) != null;
    }

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

    useNormalKeys(activate: boolean): void {
        this.normalKeys = activate;
    }
}
