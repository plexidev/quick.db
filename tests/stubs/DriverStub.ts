import { IDriver } from "../../src/drivers/IDriver";
import { DatabaseStub } from "./DatabaseStub";

export const driverMock = {
    prepare: jest.fn(
        async (table: string) => (DatabaseStub.insertTable(table), null)
    ),
    getAllRows: jest.fn(async (table: string) => {
        return Object.entries(DatabaseStub.extractTable(table)).map((row) => {
            return { id: row[0], value: row[1] };
        });
    }),
    getRowByKey: jest.fn(async (table: string, key: string) => {
        return DatabaseStub.extract(table, key);
    }),
    setRowByKey: jest.fn(async (table: string, key: string, value: any) => {
        DatabaseStub.insert(table, key, value);
        return value;
    }),
    deleteAllRows: jest.fn(async (table: string) => {
        const l = Object.keys(DatabaseStub.extractTable(table)).length;
        DatabaseStub.insertTable(table);
        return l;
    }),
    deleteRowByKey: jest.fn(async (table: string, key: string) => {
        DatabaseStub.delete(table, key);
        return 1;
    }),
} as IDriver;
