import { IDriver } from "./IDriver";
import type { mysqlModule, Pool, PoolConfig } from "promise-mysql";

export class MySQLDriver implements IDriver {
    private static instance: MySQLDriver;
    mysql: mysqlModule;
    conn?: Pool;
    config: string | PoolConfig;

    constructor(config: string | PoolConfig) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        this.config = config;
        this.mysql = require("promise-mysql");
    }

    static createSingleton(config: string | PoolConfig): MySQLDriver {
        if (!this.instance) this.instance = new MySQLDriver(config);
        return this.instance;
    }

    private checkConnection() {
        if (this.conn == null)
            throw new Error("MySQL not connected to the database");
    }

    async connect(): Promise<void> {
        this.conn = (await this.mysql.createPool(this.config)) as any;
    }

    async prepare(table: string): Promise<void> {
        this.checkConnection();

        await this.conn?.query(
            `CREATE TABLE IF NOT EXISTS ${table} (ID TEXT, json TEXT)`
        );
    }

    async getAllRows(table: string): Promise<{ id: string; value: any }[]> {
        this.checkConnection();

        const results = await this.conn?.query(`SELECT * FROM ${table}`);
        return results.map((row: any) => ({
            id: row.ID,
            value: JSON.parse(row.json),
        }));
    }

    async getRowByKey<T>(
        table: string,
        key: string
    ): Promise<[T | null, boolean]> {
        this.checkConnection();

        const results = await this.conn?.query(
            `SELECT json FROM ${table} WHERE ID = ?`,
            [key]
        );

        if (results.length == 0) return [null, false];
        return [JSON.parse(results[0].json), true];
    }

    async setRowByKey<T>(
        table: string,
        key: string,
        value: any,
        update: boolean
    ): Promise<T> {
        const stringifiedJson = JSON.stringify(value);

        if (update) {
            await this.conn?.query(
                `UPDATE ${table} SET json = (?) WHERE ID = (?)`,
                [stringifiedJson, key]
            );
        } else {
            await this.conn?.query(
                `INSERT INTO ${table} (ID,json) VALUES (?,?)`,
                [key, stringifiedJson]
            );
        }

        return value;
    }

    async deleteAllRows(table: string): Promise<number> {
        this.checkConnection();

        const result = await this.conn?.query(`DELETE FROM ${table}`);
        return result.affectedRows;
    }

    async deleteRowByKey(table: string, key: string): Promise<number> {
        this.checkConnection();

        const result = await this.conn?.query(
            `DELETE FROM ${table} WHERE ID=?`,
            [key]
        );
        return result.affectedRows;
    }
}
