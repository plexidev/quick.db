import { MemoryDriver } from "./MemoryDriver";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { writeFile } from "fs/promises";

type DataLike<T = any> = { id: string; value: T };

export class JSONDriver extends MemoryDriver {
    public constructor(public path = "./quickdb.json") {
        super();
        // synchronously load contents before initializing
        this._read();
    }

    private _read() {
        if (existsSync(this.path)) {
            const contents = readFileSync(this.path, { encoding: "utf-8" });

            try {
                const data = JSON.parse(contents);
                for (const table in data) {
                    const store = this.$getOrCreateTable(table);
                    data[table].forEach((d: DataLike) =>
                        store.set(d.id, d.value)
                    );
                }
            } catch {
                throw new Error("Database malformed");
            }
        } else {
            writeFileSync(this.path, "{}");
        }
    }

    public async export() {
        const val: Record<string, DataLike[]> = {};

        for (const tableName of this.$store.keys()) {
            val[tableName] = await this.getAllRows(tableName);
        }

        return val;
    }

    public async snapshot() {
        const data = await this.export();
        await writeFile(this.path, JSON.stringify(data));
    }

    public async deleteAllRows(table: string): Promise<number> {
        const val = super.deleteAllRows(table);
        await this.snapshot();
        return val;
    }

    public async deleteRowByKey(table: string, key: string): Promise<number> {
        const val = super.deleteRowByKey(table, key);
        await this.snapshot();
        return val;
    }

    public async setRowByKey<T>(
        table: string,
        key: string,
        value: any,
        update: boolean
    ): Promise<T> {
        const val = super.setRowByKey<T>(table, key, value, update);
        await this.snapshot();
        return val;
    }
}
