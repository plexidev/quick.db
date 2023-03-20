import { IDriver } from "./IDriver";
import MySQLModule from "mysql2/promise";
export type Config = string | MySQLModule.PoolOptions;

export class MySQLDriver implements IDriver {
    mysql: typeof MySQLModule;
    conn?: MySQLModule.Pool;
    config: Config;

    constructor(config: Config) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        this.config = config;
        this.mysql = require("mysql2/promise");
    }

    private checkConnection() {
        if (this.conn == null)
            throw new Error("MySQL not connected to the database");
    }

    async connect(): Promise<void> {
        // This is needed for typescript typecheking
        // For some reason, it doesn't work even if createPool needs a string and in an overload a PoolOptions
        if (typeof this.config == "string") {
            this.conn = await this.mysql.createPool(this.config);
        } else {
            this.conn = await this.mysql.createPool(this.config);
        }
    }

    async prepare(table: string): Promise<void> {
        this.checkConnection();

        await this.conn!.query(
            `CREATE TABLE IF NOT EXISTS ${table} (ID TEXT, json TEXT)`
        );
    }

    async getAllRows(table: string): Promise<{ id: string; value: any }[]> {
        this.checkConnection();

        const results = await this.conn!.query(`SELECT * FROM ${table}`);
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

        const [rows] = await this.conn!.query<MySQLModule.RowDataPacket[]>(
            `SELECT json FROM ${table} WHERE ID = ?`,
            [key]
        );

        if (rows.length == 0) return [null, false];
        return [JSON.parse(rows[0].json), true];
    }

    async setRowByKey<T>(
        table: string,
        key: string,
        value: any,
        update: boolean
    ): Promise<T> {
        this.checkConnection();
        const stringifiedJson = JSON.stringify(value);

        if (update) {
            await this.conn!.query(
                `UPDATE ${table} SET json = (?) WHERE ID = (?)`,
                [stringifiedJson, key]
            );
        } else {
            await this.conn!.query(
                `INSERT INTO ${table} (ID,json) VALUES (?,?)`,
                [key, stringifiedJson]
            );
        }

        return value;
    }

    async deleteAllRows(table: string): Promise<number> {
        this.checkConnection();

        const [rows] = await this.conn!.query<MySQLModule.OkPacket>(
            `DELETE FROM ${table}`
        );
        return rows.affectedRows;
    }

    async deleteRowByKey(table: string, key: string): Promise<number> {
        this.checkConnection();

        const [rows] = await this.conn!.query<MySQLModule.OkPacket>(
            `DELETE FROM ${table} WHERE ID=?`,
            [key]
        );
        return rows.affectedRows;
    }
}
