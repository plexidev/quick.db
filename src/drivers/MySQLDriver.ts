import {
    OkPacket,
    Pool,
    PoolOptions,
    RowDataPacket,
    createPool,
} from "mysql2/promise";
import { IRemoteDriver } from "../interfaces/IRemoteDriver";
export type Config = string | PoolOptions;

export class MySQLDriver implements IRemoteDriver {
    private static instance: MySQLDriver;
    private conn?: Pool;
    private config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    static createSingleton(config: string | Config): MySQLDriver {
        if (!this.instance) this.instance = new MySQLDriver(config);
        return this.instance;
    }

    private checkConnection(): void {
        if (!this.conn) {
            throw new Error("MySQL not connected to the database");
        }
    }

    async connect(): Promise<void> {
        // This is needed for typescript typecheking
        // For some reason, it doesn't work even if createPool needs a string and in an overload a PoolOptions
        if (typeof this.config == "string") {
            this.conn = createPool(this.config);
        } else {
            this.conn = createPool(this.config);
        }
    }

    async disconnect(): Promise<void> {
        this.checkConnection();
        await this.conn!.end();
    }

    async prepare(table: string): Promise<void> {
        this.checkConnection();

        await this.conn!.query(
            `CREATE TABLE IF NOT EXISTS ${table} (ID VARCHAR(255) PRIMARY KEY, json TEXT)`
        );
    }

    async getAllRows(table: string): Promise<{ id: string; value: any }[]> {
        this.checkConnection();

        const [rows] = await this.conn!.query<RowDataPacket[]>(
            `SELECT * FROM ${table}`
        );
        return rows.map((row: any) => ({
            id: row.ID,
            value: JSON.parse(row.json),
        }));
    }

    async getRowByKey<T>(
        table: string,
        key: string
    ): Promise<[T | null, boolean]> {
        this.checkConnection();

        const [rows] = await this.conn!.query<RowDataPacket[]>(
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

        const [rows] = await this.conn!.query<OkPacket>(`DELETE FROM ${table}`);
        return rows.affectedRows;
    }

    async deleteRowByKey(table: string, key: string): Promise<number> {
        this.checkConnection();

        const [rows] = await this.conn!.query<OkPacket>(
            `DELETE FROM ${table} WHERE ID=?`,
            [key]
        );
        return rows.affectedRows;
    }
}
