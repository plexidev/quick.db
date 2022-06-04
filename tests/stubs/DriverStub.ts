import { IDriver } from "../../src/drivers/IDriver";

export const database = { json: {} } as any;
export const driverMock = {
    prepare: jest.fn(async (table: string) => ((database[table] = {}), null)),
    getAllRows: jest.fn(async (table: string) => {
        return Object.entries(database[table]).map((row) => {
            return { id: row[0], value: row[1] };
        });
    }),
    getRowByKey: jest.fn(async (table: string, key: string) => {
        return database[table][key];
    }),
    setRowByKey: jest.fn(async (table: string, key: string, value: any) => {
        database[table][key] = value;
        return value;
    }),
    deleteAllRows: jest.fn(async (table: string) => {
        const l = Object.keys(database[table]).length;
        database[table] = {};
        return l;
    }),
    deleteRowByKey: jest.fn(async (table: string, key: string) => {
        delete database[table][key];
        return 1;
    }),
} as IDriver;
