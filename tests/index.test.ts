import { QuickDB, IDriver } from "../src";
import { faker } from "@faker-js/faker";

const driverMock = {
    data: {},
    getAllRows: jest.fn(async () => {
        return Object.entries(driverMock.data).map((row) => {
            return { id: row[0], value: row[1] };
        });
    }),
    getRowByKey: jest.fn(async (key: string) => {
        return driverMock.data[key];
    }),
    setRowByKey: jest.fn(async (key: string, value: any) => {
        driverMock.data[key] = value;
        return value;
    }),
    deleteAllRows: jest.fn(async () => {
        const l = Object.keys(driverMock.data).length;
        driverMock.data = {};
        return l;
    }),
    deleteRowByKey: jest.fn(async (key: string) => {
        delete driverMock.data[key];
        return 1;
    }),
} as IDriver & { data: any };

const db = new QuickDB({
    driver: driverMock,
});

describe("QuickDB", () => {
    describe("String tests", () => {
        let testDataLength: number;
        let testData = [] as { id: string; value: string }[];
        beforeAll(() => {
            testDataLength = Math.floor(Math.random() * 50);
            testData = [] as { id: string; value: string }[];
            for (let i = 0; i < testDataLength; i++) {
                testData.push({
                    id: faker.datatype.uuid(),
                    value: faker.name.findName(),
                });
            }
        });

        test("set", async () => {
            for (const data of testData) {
                const result = await db.set(data.id, data.value);
                expect(result).toEqual(data.value);
                expect(driverMock.setRowByKey).toHaveBeenLastCalledWith(
                    data.id,
                    data.value,
                    false
                );
            }

            expect(driverMock.setRowByKey).toHaveBeenCalledTimes(
                testDataLength
            );
            (driverMock.setRowByKey as jest.Mock).mockClear();
        });
    });
});
