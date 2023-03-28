import { IDriver } from "./IDriver";

export type Table = Map<string, any>;

export class MemoryDriver implements IDriver {
    public store = new Map<string, Table>();

    public async prepare(table: string): Promise<void> {
        this.getOrCreateTable(table);
    }

    public getOrCreateTable(name: string): Table {
        const table = this.store.get(name);
        if (table) return table;

        const newTable = new Map();
        this.store.set(name, newTable);
        return newTable;
    }

    public async deleteAllRows(table: string): Promise<number> {
        const store = this.getOrCreateTable(table);
        const len = store.size;
        store.clear();
        return len;
    }

    public async deleteRowByKey(table: string, key: string): Promise<number> {
        const store = this.getOrCreateTable(table);
        return +store.delete(key);
    }

    public async getAllRows(
        table: string
    ): Promise<{ id: string; value: any }[]> {
        const store = this.getOrCreateTable(table);
        return [...store.entries()].map(([k, v]) => ({ id: k, value: v }));
    }

    public async getRowByKey<T>(
        table: string,
        key: string
    ): Promise<[T | null, boolean]> {
        const store = this.getOrCreateTable(table);
        const val = store.get(key) as T;
        return [val == null ? null : val, false];
    }

    public async setRowByKey<T>(
        table: string,
        key: string,
        value: any,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        update: boolean
    ): Promise<T> {
        const store = this.getOrCreateTable(table);
        store.set(key, value);
        return store.get(key);
    }
}
