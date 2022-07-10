import { set, get, unset } from "lodash";
import { IDriver } from "./drivers/IDriver";
import { SqliteDriver } from "./drivers/SqliteDriver";

export { IDriver } from "./drivers/IDriver";
export { MySQLDriver } from "./drivers/MySQLDriver";
export { SqliteDriver } from "./drivers/SqliteDriver";

export interface IQuickDBOptions {
    table?: string;
    filePath?: string;
    driver?: IDriver;
}

export class QuickDB {
    driver: IDriver;
    tableName: string;
    options: IQuickDBOptions;

    constructor(options: IQuickDBOptions = {}) {
        options.table ??= "json";
        options.filePath ??= "json.sqlite";
        options.driver ??= new SqliteDriver(options.filePath);

        this.options = options;
        this.driver = options.driver;
        this.tableName = options.table;

        this.driver.prepare(this.tableName);
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

        sub ? (currentNumber -= value) : (currentNumber += value);
        return this.set<number>(key, currentNumber);
    }

    private async getArray<T>(key: string): Promise<T[]> {
        const currentArr = (await this.get<T[]>(key)) ?? [];

        if (!Array.isArray(currentArr))
            throw new Error(`Current value with key: (${key}) is not an array`);

        return currentArr;
    }

    async all(): Promise<{ id: string; value: any }[]> {
        return this.driver.getAllRows(this.tableName);
    }

    async get<T>(key: string): Promise<T | null> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");

        if (key.includes(".")) {
            const keySplit = key.split(".");
            const result = await this.driver.getRowByKey(
                this.tableName,
                keySplit[0]
            );
            return get(result, keySplit.slice(1).join("."));
        }

        return this.driver.getRowByKey(this.tableName, key);
    }

    async set<T>(key: string, value: any): Promise<T> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");
        if (value == null) throw new Error("Missing second argument (value)");

        if (key.includes(".")) {
            const keySplit = key.split(".");
            let obj = await this.get<any>(keySplit[0]);
            const update = obj != null;
            // If it's not an instance of an object (rewrite it)
            if (obj instanceof Object == false) {
                obj = {};
            }

            const valueSet = set(obj ?? {}, keySplit.slice(1).join("."), value);
            return this.driver.setRowByKey(
                this.tableName,
                keySplit[0],
                valueSet,
                update
            );
        }

        const update = await this.has(key);
        return this.driver.setRowByKey(this.tableName, key, value, update);
    }

    async has(key: string): Promise<boolean> {
        return (await this.get(key)) != null;
    }

    async delete(key: string): Promise<number> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");

        if (key.includes(".")) {
            const keySplit = key.split(".");
            const obj = await this.get<any>(keySplit[0]);
            unset(obj ?? {}, keySplit.slice(1).join("."));
            return this.driver.setRowByKey(
                this.tableName,
                keySplit[0],
                obj,
                obj != null
            );
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

    async push<T>(key: string, value: any | any[]): Promise<T[]> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");
        if (value == null) throw new Error("Missing second argument (value)");

        let currentArr = await this.getArray<T>(key);

        if (Array.isArray(value)) currentArr = currentArr.concat(value);
        else currentArr.push(value);

        return this.set(key, currentArr);
    }

    async pull<T>(
        key: string,
        value: any | any[] | ((data: any) => boolean)
    ): Promise<T[]> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");
        if (value == null) throw new Error("Missing second argument (value)");

        let currentArr = await this.getArray<T>(key);

        if (!Array.isArray(value) && typeof value != "function")
            value = [value];

        currentArr = currentArr.filter((e) =>
            Array.isArray(value) ? !value.includes(e) : !value(e)
        );

        return this.set(key, currentArr);
    }

    async startsWith<T>(
        query: string,
        key: string = ''
    ): Promise<{ id: string; value: any }[]> {

        if (typeof query != "string")
            throw new Error("First argument (query) needs to be a string");
        if (typeof key != "string")
            throw new Error("Second argument (key) needs to be a string");

        // Get either the whole db or the rows from the provided key
        // -> Filter the result if the id starts with the provided query
        // -> Return the filtered result
        return ((key === '' ? await this.all() : await this.get(key) ?? []) as { id: string; value: any }[]).filter((v) => v.id.startsWith(query));
    }

    table(table: string): QuickDB {
        if (typeof table != "string")
            throw new Error("First argument (table) needs to be a string");

        const options = { ...this.options };

        options.table = table;
        options.driver = this.options.driver;
        return new QuickDB(options);
    }
}
