import { IDriver } from "./drivers/IDriver";
import { SqliteDriver } from "./drivers/SqliteDriver";
import { set, get } from "lodash";

export { IDriver } from "./drivers/IDriver";
export { SqliteDriver } from "./drivers/SqliteDriver";
export { MySQLDriver } from "./drivers/MySQLDriver";

export interface IQuickDBOptions {
    filePath?: string;
    table?: string;
    driver?: IDriver;
}

export class QuickDB {
    options: IQuickDBOptions;
    table: string;
    driver: IDriver;

    constructor(options: IQuickDBOptions = {}) {
        options.filePath ??= "json.sqlite";
        options.driver ??= new SqliteDriver(options.filePath);
        options.table ??= "DB";
        this.options = options;
        this.table = options.table;
        this.driver = options.driver;

        this.driver.prepare(this.table);
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
        return this.driver.getAllRows(this.table);
    }

    async get<T>(key: string): Promise<T | null> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");

        if (key.includes(".")) {
            const keySplit = key.split(".");
            const result = await this.driver.getRowByKey(
                this.table,
                keySplit[0]
            );
            return get(result, keySplit.slice(1).join("."));
        }

        return this.driver.getRowByKey(this.table, key);
    }

    async set<T>(key: string, value: any): Promise<T> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");
        if (value == null) throw new Error("Missing second argument (value)");

        if (key.includes(".")) {
            const keySplit = key.split(".");
            const obj = await this.get<any>(keySplit[0]);
            const valueSet = set(obj ?? {}, keySplit.slice(1).join("."), value);
            return this.driver.setRowByKey(
                this.table,
                keySplit[0],
                valueSet,
                obj != null
            );
        }

        const update = await this.has(key);
        return this.driver.setRowByKey(this.table, key, value, update);
    }

    async has(key: string): Promise<boolean> {
        return (await this.get(key)) != null;
    }

    async delete(key: string): Promise<number> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");

        return this.driver.deleteRowByKey(this.table, key);
    }

    async deleteAll(): Promise<number> {
        return this.driver.deleteAllRows(this.table);
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

    useTable(table: string): QuickDB {
        if (typeof table != "string")
            throw new Error("First argument (table) needs to be a string");

        const options = { ...this.options };
        options.driver = this.options.driver;
        options.table = table;
        return new QuickDB(options);
    }
}
