import PgModule from "pg";
import { IRemoteDriver } from "../interfaces/IRemoteDriver";

export class PostgresDriver implements IRemoteDriver {
    private static instance: PostgresDriver;
    private readonly _pg: typeof PgModule;
    private config: PgModule.ClientConfig;
    private conn: PgModule.Client | undefined;

    get pg(): typeof PgModule {
        return this._pg;
    }

    constructor(config: PgModule.ClientConfig) {
        this.config = config;
        this._pg = require("pg");
    }

    static createSingleton(config: PgModule.ClientConfig): PostgresDriver {
        if (!this.instance) this.instance = new PostgresDriver(config);
        return this.instance;
    }

    async connect(): Promise<void> {
        this.conn = new PgModule.Client(this.config);
        await this.conn.connect();
    }

    async disconnect(): Promise<void> {
        this.checkConnection();
        await this.conn!.end();
    }

    private checkConnection(): void {
        if (!this.conn) {
            throw new Error("No connection to postgres database");
        }
    }

    async prepare(table: string): Promise<void> {
        this.checkConnection();
        await this.conn!.query(
            `CREATE TABLE IF NOT EXISTS ${table} (id VARCHAR(255), value TEXT)`
        );
    }

    async getAllRows(table: string): Promise<{ id: string; value: any }[]> {
        this.checkConnection();
        const queryResult = await this.conn!.query(`SELECT * FROM ${table}`);
        return queryResult.rows.map((row) => ({
            id: row.id,
            value: JSON.parse(row.value),
        }));
    }

    async getRowByKey<T>(
        table: string,
        key: string
    ): Promise<[T | null, boolean]> {
        this.checkConnection();
        const queryResult = await this.conn!.query(
            `SELECT value FROM ${table} WHERE id = $1`,
            [key]
        );

        if (queryResult.rowCount < 1) return [null, false];
        return [JSON.parse(queryResult.rows[0].value), true];
    }

    async setRowByKey<T>(
        table: string,
        key: string,
        value: any,
        update: boolean
    ): Promise<T> {
        this.checkConnection();

        const stringifiedValue = JSON.stringify(value);

        if (update) {
            await this.conn!.query(
                `UPDATE ${table} SET value = $1 WHERE id = $2`,
                [stringifiedValue, key]
            );
        } else {
            await this.conn!.query(
                `INSERT INTO ${table} (id, value) VALUES ($1, $2)`,
                [key, stringifiedValue]
            );
        }

        return value;
    }

    async deleteAllRows(table: string): Promise<number> {
        this.checkConnection();
        const queryResult = await this.conn!.query(`DELETE FROM ${table}`);
        return queryResult.rowCount;
    }

    async deleteRowByKey(table: string, key: string): Promise<number> {
        this.checkConnection();
        const queryResult = await this.conn!.query(
            `DELETE FROM ${table} WHERE id = $1`,
            [key]
        );
        return queryResult.rowCount;
    }
}
