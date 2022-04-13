import { IDriver } from "./IDriver";
import type { ConnectionConfig, Connection } from "promise-mysql";

export class MySQLDriver implements IDriver {
    mysql: any;
    config: string | ConnectionConfig;
    conn?: Connection;

    constructor(config: string | ConnectionConfig) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        this.mysql = require("promise-mysql");
        this.config = config;
    }

    private checkConnection() {
        if (this.conn == null)
            throw new Error("MySQL not connected to the database");
    }

    async connect(): Promise<void> {
        this.conn = await this.mysql.createConnection(this.config);
    }

    async prepare(table: string): Promise<void> {
        this.checkConnection();
        await this.conn?.query(
            `CREATE TABLE IF NOT EXISTS ${table} (ID TEXT, Json TEXT)`
        );
    }

    async getAllRows(table: string): Promise<{ id: string; value: any }[]> {
        this.checkConnection();
        const results = await this.conn?.query(`SELECT * FROM ${table}`);
        return results.map((row: any) => ({
            id: row.ID,
            value: JSON.parse(row.Json),
        }));
    }

    async getRowByKey<T>(table: string, key: string): Promise<T | null> {
        this.checkConnection();
        const results = await this.conn?.query(
            `SELECT Json FROM ${table} WHERE ID = ?`,
            [key]
        );
        if (results.length == 0) return null;
        return JSON.parse(results[0].Json);
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
                `UPDATE ${table} SET Json = (?) WHERE ID = (?)`,
                [stringifiedJson, key]
            );
        } else {
            await this.conn?.query(
                `INSERT INTO ${table} (ID,Json) VALUES (?,?)`,
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
