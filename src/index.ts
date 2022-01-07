import { IDriver } from "./drivers/IDriver";
import { SqliteDriver } from "./drivers/SqliteDriver";
import { set, get } from "lodash";

export { IDriver } from "./drivers/IDriver";
export { SqliteDriver } from "./drivers/SqliteDriver";
export { MySQLDriver } from "./drivers/MySQLDriver";

export interface IQuickDBOptions {
    filePath?: string;
    driver?: IDriver;
}

export class QuickDB {
    driver: IDriver;

    constructor(options: IQuickDBOptions = {}) {
        options.filePath ??= "json.sqlite";
        options.driver ??= new SqliteDriver(options.filePath);
        this.driver = options.driver;
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
                    `Current value with key: (${key}) is not a number and coudln't be parsed to a number`
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
        return this.driver.getAllRows();
    }

    async get<T>(key: string): Promise<T | null> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");

        if (key.includes(".")) {
            const keySplit = key.split(".");
            const result = await this.driver.getRowByKey(keySplit[0]);
            return get(result, keySplit.slice(1).join("."));
        }

        return this.driver.getRowByKey(key);
    }

    async set<T>(key: string, value: any): Promise<T> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");
        if (value == null) throw new Error("Missing second argument (value)");

        if (key.includes(".")) {
            const keySplit = key.split(".");
            const obj = await this.get<any>(keySplit[0]);
            const valueSet = set(obj ?? {}, keySplit.slice(1).join("."), value);
            return this.driver.setRowByKey(keySplit[0], valueSet, obj != null);
        }

        const obj = await this.get<any>(key);
        return this.driver.setRowByKey(key, value, obj != null);
    }

    async has(key: string): Promise<boolean> {
        return (await this.get(key)) != null;
    }

    async delete(key: string): Promise<number> {
        if (typeof key != "string")
            throw new Error("First argument (key) needs to be a string");

        return this.driver.deleteRowByKey(key);
    }

    async deleteAll(): Promise<number> {
        return this.driver.deleteAllRows();
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
}
