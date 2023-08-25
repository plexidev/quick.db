import { IDriver } from '../interfaces/IDriver';
import { isConnectable } from '../utilities';

/**
 * DriverUnion - Union of Drivers
 *
 * This driver allows the usage of multiple drivers and multiple driver instances at the same time.
 * Useful for redundancies and live backups.
 *
 * The main driver is the driver used for all operations, while the rest of the drivers are called
 * mirror drivers, and are only used for data reflection.
 * By the default, the main driver is the first one the union is initialized with.
 * This can be changed by modifying the {@link DriverUnion.main | `main` property} on the union instance.
 *
 * @example
 * const SQLiteInstance = new SqliteDriver("./json.sqlite")
 * const JSONInstance = new JSONDriver("./backup.json");
 * const DriverUnionInstance = new DriverUnion(SQLiteInstance, JSONInstance);
 * const db = new QuickDB({ driver: DriverUnionInstance })
 *
 * // Regular db usage
 */
export class DriverUnion implements IDriver {
    private drivers: IDriver[];
    private _main: number;

    /** @property {number} main Index of the main driver. */
    public get main(): number {
        return this._main;
    }
    public set main(value: number) {
        if (!(value in this.drivers)) return;

        this._main = value;
    }

    constructor(main: IDriver, ...mirrors: IDriver[]) {
        this.drivers = [main, ...mirrors];
        this._main = 0;
    }

    public async init(): Promise<void> {
        for (const driver of this.drivers) {
            if (isConnectable(driver)) await driver.connect();
        }
    }

    public async prepare(table: string): Promise<void> {
        for (const driver of this.drivers) await driver.prepare(table);
    }

    public async getAllRows(
        table: string
    ): Promise<{ id: string; value: any }[]> {
        const main = this.drivers[this._main];
        return await main.getAllRows(table);
    }

    public async getRowByKey<T>(
        table: string,
        key: string
    ): Promise<[T | null, boolean]> {
        const main = this.drivers[this._main];
        return await main.getRowByKey<T>(table, key);
    }

    public async setRowByKey<T>(
        table: string,
        key: string,
        value: any,
        update: boolean
    ): Promise<T> {
        let val: T = undefined as T; // It's guaranteed that at least one driver is present.

        for (let i = 0; i < this.drivers.length; i++) {
            const driver = this.drivers[i];

            const res = await driver.setRowByKey<T>(table, key, value, update);
            if (i === this._main) val = res;
        }

        return val;
    }

    public async deleteAllRows(table: string): Promise<number> {
        let rows = 0;
        for (let i = 0; i < this.drivers.length; i++) {
            const driver = this.drivers[i];

            const delRows = await driver.deleteAllRows(table);
            if (i === this._main) rows = delRows;
        }

        return rows;
    }

    public async deleteRowByKey(table: string, key: string): Promise<number> {
        let rows = 0;
        for (let i = 0; i < this.drivers.length; i++) {
            const driver = this.drivers[i];

            const delRows = await driver.deleteRowByKey(table, key);
            if (i === this._main) rows = delRows;
        }

        return rows;
    }
}
