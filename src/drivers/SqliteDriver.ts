import { IDriver } from "./IDriver";
import type { Database } from "better-sqlite3";

export class SqliteDriver implements IDriver {
    database: Database;

    constructor(path: string) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const sqlite3 = require("better-sqlite3");
        this.database = sqlite3(path);
        this.database
            .prepare("CREATE TABLE IF NOT EXISTS DB (ID TEXT, Json TEXT)")
            .run();
    }

    async getAllRows(): Promise<{ id: string; value: any }[]> {
        const prep = this.database.prepare("SELECT * FROM DB");
        const data = [];
        for (const row of prep.iterate()) {
            data.push({
                id: row.ID,
                value: JSON.parse(row.Json),
            });
        }

        return data;
    }

    async getRowByKey<T>(key: string): Promise<T | null> {
        const value = await this.database
            .prepare("SELECT Json FROM DB WHERE ID = @key")
            .get({
                key,
            });

        return value != null ? JSON.parse(value.Json) : null;
    }

    async setRowByKey<T>(key: string, value: any, update: boolean): Promise<T> {
        const stringifiedJson = JSON.stringify(value);
        if (update) {
            this.database
                .prepare("UPDATE DB SET Json = (?) WHERE ID = (?)")
                .run(stringifiedJson, key);
        } else {
            this.database
                .prepare("INSERT INTO DB (ID,Json) VALUES (?,?)")
                .run(key, stringifiedJson);
        }

        return value;
    }

    async deleteAllRows(): Promise<number> {
        return this.database.prepare("DELETE FROM DB").run().changes;
    }

    async deleteRowByKey(key: string): Promise<number> {
        return this.database.prepare("DELETE FROM DB WHERE ID=@key").run({
            key,
        }).changes;
    }
}
