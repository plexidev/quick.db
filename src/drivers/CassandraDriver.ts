import { IRemoteDriver } from "../interfaces/IRemoteDriver";
import { Client, ClientOptions } from "cassandra-driver";

export class CassandraDriver implements IRemoteDriver {
    private static instance: CassandraDriver;
    private _client: Client | undefined;
    private config: ClientOptions;

    constructor(config: ClientOptions) {
        this.config = config;
    }

    static createSingleton(config: ClientOptions): CassandraDriver {
        if (!this.instance) this.instance = new CassandraDriver(config);
        return this.instance;
    }

    public async connect(): Promise<void> {
        this._client = new Client(this.config);
    }

    public async disconnect(): Promise<void> {
        this.checkConnection();
        await this._client!.shutdown();
    }

    private checkConnection(): void {
        if (this._client === null) {
            throw new Error("No connection to cassandra database");
        }
    }

    public async prepare(table: string): Promise<void> {
        this.checkConnection();

        await this._client!.execute(
            "CREATE KEYSPACE IF NOT EXISTS quickdb WITH replication = {'class': 'NetworkTopologyStrategy', 'replication_factor': '1' }"
        );

        await this._client!.execute("USE quickdb");

        await this._client!.execute(
            `CREATE TABLE IF NOT EXISTS ${table} (id varchar, key varchar, value TEXT, PRIMARY KEY(id))`
        );

        await this._client!
            .execute(`CREATE CUSTOM INDEX IF NOT EXISTS key_index ON ${table} (key)
                USING 'org.apache.cassandra.index.sasi.SASIIndex'
                WITH OPTIONS = {
                    'mode': 'CONTAINS',
                    'analyzer_class': 'org.apache.cassandra.index.sasi.analyzer.NonTokenizingAnalyzer',
                    'case_sensitive': 'false'
                }
        `);
    }

    public async getAllRows(
        table: string
    ): Promise<{ id: string; value: any }[]> {
        this.checkConnection();

        const queryResult = await this._client!.execute(
            `SELECT * FROM ${table}`
        );

        return queryResult.rows.map((row) => ({
            id: row.key,
            value: JSON.parse(row.value),
        }));
    }

    public async getStartsWith(
        table: string,
        query: string
    ): Promise<{ id: string; value: any }[]> {
        this.checkConnection();

        const queryResult = await this._client!.execute(
            `SELECT * FROM ${table} WHERE key LIKE ?`,
            [`${query}%`],
            { prepare: true }
        );

        return queryResult.rows.map((row) => ({
            id: row.key,
            value: JSON.parse(row.value),
        }));
    }

    public async getRowByKey<T>(
        table: string,
        key: string
    ): Promise<[T | null, boolean]> {
        this.checkConnection();

        const queryResult = await this._client!.execute(
            `SELECT value FROM ${table} WHERE id = ?`,
            [key],
            { prepare: true }
        );

        return queryResult.rowLength < 1
            ? [null, false]
            : [JSON.parse(queryResult.rows[0].value), true];
    }

    public async setRowByKey<T>(
        table: string,
        key: string,
        value: any,
        update: boolean
    ): Promise<T> {
        this.checkConnection();

        const stringifiedValue = JSON.stringify(value);

        if (update) {
            await this._client!.execute(
                `UPDATE ${table} SET value = ? WHERE key = ?`,
                [stringifiedValue, key],
                { prepare: true }
            );
        } else {
            await this._client!.execute(
                `INSERT INTO ${table} (id, key, value) VALUES (?, ?, ?)`,
                [key, key, stringifiedValue],
                { prepare: true }
            );
        }

        return value;
    }

    public async deleteAllRows(table: string): Promise<number> {
        this.checkConnection();

        const queryResult = await this._client!.execute(`TRUNCATE ${table}`);
        return queryResult.rowLength;
    }

    public async deleteRowByKey(table: string, key: string): Promise<number> {
        this.checkConnection();

        const queryResult = await this._client!.execute(
            `DELETE FROM ${table} WHERE id = ?`,
            [key],
            { prepare: true }
        );

        return queryResult.rowLength;
    }
}
