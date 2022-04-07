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

function generateTestData(fakerFunc: () => unknown) {
    const length = Math.floor(Math.random() * 50);
    const testData = [];
    for (let i = 0; i < length; i++) {
        testData.push({
            id: faker.datatype.uuid(),
            value: fakerFunc(),
        });
    }

    return {
        length,
        testData,
    };
}

describe("QuickDB", () => {
    describe("String tests", () => {
        let testData;
        let testDataLength;
        beforeAll(() => {
            const tData = generateTestData(faker.name.findName);
            testData = tData.testData;
            testDataLength = tData.length;
        });

        afterEach(() => {
            for (const att of Object.values(driverMock)) {
                if (typeof att == "function") {
                    (att as jest.Mock).mockClear();
                }
            }
        });

        test("set_good", async () => {
            for (const data of testData) {
                const result = await db.set(data.id, data.value);
                expect(result).toEqual(data.value);
                expect(driverMock.setRowByKey).toHaveBeenLastCalledWith(
                    data.id,
                    data.value,
                    false
                );
                expect(driverMock.getRowByKey).toHaveBeenLastCalledWith(
                    data.id
                );
            }

            expect(driverMock.setRowByKey).toHaveBeenCalledTimes(
                testDataLength
            );
            expect(driverMock.getRowByKey).toHaveBeenCalledTimes(
                testDataLength
            );
        });

        test("get_exists", async () => {
            for (const data of testData) {
                const result = await db.get(data.id);
                expect(result).toEqual(data.value);
                expect(driverMock.getRowByKey).toHaveBeenLastCalledWith(
                    data.id
                );
            }

            expect(driverMock.getRowByKey).toHaveBeenCalledTimes(
                testDataLength
            );
        });

        test("has_exists", async () => {
            for (const data of testData) {
                const result = await db.has(data.id);
                expect(result).toEqual(true);
                expect(driverMock.getRowByKey).toHaveBeenCalledWith(data.id);
            }

            expect(driverMock.getRowByKey).toHaveBeenCalledTimes(
                testDataLength
            );
        });

        test("all", async () => {
            const results = await db.all();
            expect(results).toHaveLength(testDataLength);
            expect(results).toEqual(expect.arrayContaining(testData));
            expect(driverMock.getAllRows).toHaveBeenCalledTimes(1);
        });

        test("delete_exists", async () => {
            const result = await db.delete(testData[0].id);
            expect(result).toEqual(1);
            expect(driverMock.deleteRowByKey).toHaveBeenLastCalledWith(
                testData[0].id
            );
            expect(db.has(testData[0].id)).resolves.toEqual(false);
            testDataLength--;
            testData.shift();
        });

        test("delete_all", async () => {
            const result = await db.deleteAll();
            expect(result).toEqual(testDataLength);
            expect(driverMock.deleteAllRows).toHaveBeenCalled();
            expect(db.all()).resolves.toHaveLength(0);
        });
    });
});
