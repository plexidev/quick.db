import { MemoryDriver } from "./MemoryDriver";
import { existsSync, readFileSync } from "fs";
import { readFile } from "fs/promises";
import writeFile from "write-file-atomic";

export type DataLike<T = any> = { id: string; value: T };

export class JSONDriver extends MemoryDriver {
    public constructor(public path = "./quickdb.json") {
        super();
        // synchronously load contents before initializing
        this.loadContentSync();
    }

    public loadContentSync(): void {
        if (existsSync(this.path)) {
            const contents = readFileSync(this.path, { encoding: "utf-8" });

            try {
                const data = JSON.parse(contents);
                for (const table in data) {
                    const store = this.getOrCreateTable(table);
                    data[table].forEach((d: DataLike) =>
                        store.set(d.id, d.value)
                    );
                }
            } catch {
                throw new Error("Database malformed");
            }
        } else {
            writeFile.sync(this.path, "{}");
        }
    }

    public async loadContent(): Promise<void> {
        if (existsSync(this.path)) {
            const contents = await readFile(this.path, { encoding: "utf-8" });

            try {
                const data = JSON.parse(contents);
                for (const table in data) {
                    const store = this.getOrCreateTable(table);
                    data[table].forEach((d: DataLike) =>
                        store.set(d.id, d.value)
                    );
                }
            } catch {
                throw new Error("Database malformed");
            }
        } else {
            await writeFile(this.path, "{}");
        }
    }

    public async export(): Promise<Record<string, DataLike[]>> {
        const val: Record<string, DataLike[]> = {};

        for (const tableName of this.store.keys()) {
            val[tableName] = await this.getAllRows(tableName);
        }

        return val;
    }

    public async snapshot(): Promise<void> {
        const data = await this.export();
        await writeFile(this.path, JSON.stringify(data));
    }

    public override async deleteAllRows(table: string): Promise<number> {
        const val = super.deleteAllRows(table);
        await this.snapshot();
        return val;
    }

    public override async deleteRowByKey(
        table: string,
        key: string
    ): Promise<number> {
        const val = super.deleteRowByKey(table, key);
        await this.snapshot();
        return val;
    }

    public override async setRowByKey<T>(
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
