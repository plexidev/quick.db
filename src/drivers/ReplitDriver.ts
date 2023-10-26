import { IDriver } from "../interfaces/IDriver";
import { readFileSync } from "fs";

export class ReplitDriver implements IDriver {
    private static instance: ReplitDriver;
    private replitDbFilename = "/tmp/replitdb";
    private databaseUrl: string | undefined;

    public constructor() {}

    public static createSingleton(): ReplitDriver {
        if (!this.instance) this.instance = new ReplitDriver();
        return this.instance;
    }

    private checkConnection(): void {
        if (this.databaseUrl == undefined) {
            throw new Error("Missing replit database url");
        }
    }

    private checkTableName(table: string): void {
        if (table !== "json") {
            throw new Error("This driver only supports a single table");
        }
    }

    public async prepare(table: string): Promise<void> {
        this.checkTableName(table);
        this.databaseUrl = this._readKey();
    }

    public async getAllRows(
        table: string
    ): Promise<{ id: string; value: any }[]> {
        this.checkConnection();
        this.checkTableName(table);

        const allKeys = await this._getAllKeys();

        const allEntries = await Promise.all(
            allKeys.map(async (key) => {
                const value = await this.getRowByKey(table, key);
                return { id: key, value: value[0] };
            })
        );

        return allEntries as { id: string; value: any }[];
    }

    public async getRowByKey<T>(
        table: string,
        key: string
    ): Promise<[T | null, boolean]> {
        this.checkConnection();
        this.checkTableName(table);

        const res = await fetch(this.databaseUrl! + "/" + key);
        const text = await res.text();

        return [JSON.parse(text), text != null];
    }

    public async getStartsWith(
        table: string,
        query: string
    ): Promise<{ id: string; value: any }[]> {
        this.checkConnection();
        this.checkTableName(table);

        const allKeys = await this._getAllKeys(query);

        const allEntries = await Promise.all(
            allKeys.map(async (key) => {
                const value = await this.getRowByKey(table, key);
                return { id: key, value: value[0] };
            })
        );

        return allEntries as { id: string; value: any }[];
    }

    public async setRowByKey<T>(
        table: string,
        key: string,
        value: any,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        update: boolean
    ): Promise<T> {
        this.checkConnection();
        this.checkTableName(table);

        await fetch(this.databaseUrl!, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `${encodeURIComponent(key)}=${encodeURIComponent(
                JSON.stringify(value)
            )}`,
        });

        return value;
    }

    public async deleteAllRows(table: string): Promise<number> {
        this.checkConnection();
        this.checkTableName(table);

        const allKeys = await this._getAllKeys();
        const results = await Promise.all(
            allKeys.map(async (key) => {
                await this.deleteRowByKey(table, key);
            })
        );

        return results.length;
    }

    public async deleteRowByKey(table: string, key: string): Promise<number> {
        this.checkConnection();
        this.checkTableName(table);

        await fetch(`${this.databaseUrl}/${key}`, {
            method: "DELETE",
        });

        return 1;
    }

    private async _getAllKeys(query: string = ""): Promise<string[]> {
        const res = await fetch(
            `${this.databaseUrl!}?encode=true&prefix=${encodeURIComponent(
                query
            )}`
        );

        const text = await res.text();
        const lines = text.split("\n");
        return lines.map(decodeURIComponent);
    }

    private _readKey(): string | undefined {
        try {
            return readFileSync(this.replitDbFilename, "utf8");
        } catch (err) {
            return process.env.REPLIT_DB_URL;
        }
    }
}
