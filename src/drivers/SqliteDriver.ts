import { IDriver } from "./IDriver";
import type { Database } from "better-sqlite3";

export class SqliteDriver implements IDriver {
    private static instance: SqliteDriver;
    database: Database;

    constructor(path: string) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const sqlite3 = require("better-sqlite3");
        this.database = sqlite3(path);
    }

    static createSingleton(path: string): SqliteDriver {
        if (!this.instance) this.instance = new SqliteDriver(path);
        return this.instance;
    }

    async prepare(table: string): Promise<void> {
        this.database
            .prepare(`CREATE TABLE IF NOT EXISTS ${table} (ID TEXT PRIMARY KEY, json TEXT)`)
            .run();
    }

    async getAllRows(table: string): Promise<{ id: string; value: any }[]> {
        const prep = this.database.prepare(`SELECT * FROM ${table}`);
        const data = [];

        for (const row of prep.iterate()) {
            data.push({
                id: row.ID,
                value: JSON.parse(row.json),
            });
        }

        return data;
    }

    async getRowByKey<T>(
        table: string,
        key: string
    ): Promise<[T | null, boolean]> {
        const value = await this.database
            .prepare(`SELECT json FROM ${table} WHERE ID = @key`)
            .get({
                key,
            });

        return value != null ? [JSON.parse(value.json), true] : [null, false];
    }

    async setRowByKey<T>(
        table: string,
        key: string,
        value: any,
        update: boolean
    ): Promise<T> {
        const stringifiedJson = JSON.stringify(value);
        if (update) {
            this.database
                .prepare(`UPDATE ${table} SET json = (?) WHERE ID = (?)`)
                .run(stringifiedJson, key);
        } else {
            this.database
                .prepare(`INSERT INTO ${table} (ID,json) VALUES (?,?)`)
                .run(key, stringifiedJson);
        }

        return value;
    }

    async deleteAllRows(table: string): Promise<number> {
        return this.database.prepare(`DELETE FROM ${table}`).run().changes;
    }

    async deleteRowByKey(table: string, key: string): Promise<number> {
        return this.database.prepare(`DELETE FROM ${table} WHERE ID=@key`).run({
            key,
        }).changes;
    }
}
