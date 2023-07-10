import sqlite3, { Database } from "better-sqlite3";
import { IDriver } from "../interfaces/IDriver";

export class SqliteDriver implements IDriver {
    private static instance: SqliteDriver | null = null;
    private readonly _database: Database;

    get database(): Database {
        return this._database;
    }

    constructor(path: string) {
        this._database = sqlite3(path);
    }

    public static createSingleton(path: string): SqliteDriver {
        if (!SqliteDriver.instance) {
            SqliteDriver.instance = new SqliteDriver(path);
        }
        return SqliteDriver.instance;
    }

    public async prepare(table: string): Promise<void> {
        this._database.exec(
            `CREATE TABLE IF NOT EXISTS ${table} (ID TEXT PRIMARY KEY, json TEXT)`
        );
    }

    public async getAllRows(
        table: string
    ): Promise<{ id: string; value: any }[]> {
        const prep = this._database.prepare<{ ID: string; json: string }[]>(
            `SELECT * FROM ${table}`
        );
        const data = [];

        for (const row of prep.iterate()) {
            data.push({
                id: (row as { ID: string; json: string }).ID,
                value: JSON.parse((row as { ID: string; json: string }).json),
            });
        }

        return data;
    }

    public async getRowByKey<T>(
        table: string,
        key: string
    ): Promise<[T | null, boolean]> {
        const value = (await this._database
            .prepare(`SELECT json FROM ${table} WHERE ID = @key`)
            .get({ key })) as { ID: string; json: string };

        return value != null ? [JSON.parse(value.json), true] : [null, false];
    }

    public async setRowByKey<T>(
        table: string,
        key: string,
        value: any,
        update: boolean
    ): Promise<T> {
        const stringifiedJson = JSON.stringify(value);
        if (update) {
            this._database
                .prepare(`UPDATE ${table} SET json = (?) WHERE ID = (?)`)
                .run(stringifiedJson, key);
        } else {
            this._database
                .prepare(`INSERT INTO ${table} (ID,json) VALUES (?,?)`)
                .run(key, stringifiedJson);
        }

        return value;
    }

    public async deleteAllRows(table: string): Promise<number> {
        const result = this._database.prepare(`DELETE FROM ${table}`).run();
        return result.changes;
    }

    public async deleteRowByKey(table: string, key: string): Promise<number> {
        const result = this._database
            .prepare(`DELETE FROM ${table} WHERE ID=@key`)
            .run({ key });
        return result.changes;
    }
}
