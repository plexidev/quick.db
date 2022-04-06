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
