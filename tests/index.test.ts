// Just need to import
// QuickDB will create the SqliteDriver itself
// Which is auto mocked
import { driverMock, database } from "./stubs/DriverStub";
import { QuickDB } from "../src";

const db = new QuickDB({ driver: driverMock });

describe("QuickDB", () => {
    test("set_dot_insert-good", async () => {
        await expect(db.set("test.sword", "hi")).resolves.toEqual({
            sword: "hi",
        });
        expect(driverMock.setRowByKey).toHaveBeenCalledTimes(1);
        expect(driverMock.getRowByKey).toHaveBeenCalledTimes(1);
        expect(database.json).toHaveProperty("test");
        expect(database.json.test).toHaveProperty("sword");
        expect(database.json.test.sword).toEqual("hi");
    });
});

/*function injectTestData(fakerFunc: () => unknown) {
    const testData = generateTestData(fakerFunc);
    driverMock.data = {};
    for (const data of testData) {
        driverMock.data[data.id] = data.value;
    }

    return testData;
}

describe("QuickDB", () => {
    afterEach(() => {
        for (const att of Object.values(driverMock)) {
            if (typeof att == "function") {
                (att as jest.Mock).mockClear();
            }
        }

        driverMock.data = {};
    });

    describe("Test with no data", () => {
        beforeEach(() => {
            driverMock.data = {};
        });

        test("set_good", async () => {
            const settingData = generateTestData(faker.name.findName);
            for (const data of settingData) {
                const result = await db.set(data.id, data.value);
                expect(result).toEqual(data.value);
                expect(driverMock.setRowByKey).toHaveBeenLastCalledWith(
                    "json",
                    data.id,
                    data.value,
                    false
                );
                expect(driverMock.getRowByKey).toHaveBeenLastCalledWith(
                    "json",
                    data.id
                );
                expect(driverMock.data).toHaveProperty(data.id);
                expect(driverMock.data[data.id]).toEqual(data.value);
            }

            expect(driverMock.setRowByKey).toHaveBeenCalledTimes(
                settingData.length
            );
            expect(driverMock.getRowByKey).toHaveBeenCalledTimes(
                settingData.length
            );
        });

        // TODO: add custom error instead of relying on string (valuable for all errors thrown)
        test("set_bad_key", async () => {
            expect(db.set({} as any, "test")).rejects.toThrowError(
                "First argument (key) needs to be a string"
            );
        });

        test("set_missing_second_argument", async () => {
            expect(db.set("test", null)).rejects.toThrowError(
                "Missing second argument (value)"
            );
            expect(db.set("test", undefined)).rejects.toThrowError(
                "Missing second argument (value)"
            );
        });

        test("set_dot_insert-good", async () => {
            await expect(db.set("test.sword", "hi")).resolves.toEqual({
                sword: "hi",
            });
            expect(driverMock.setRowByKey).toHaveBeenCalledTimes(1);
            expect(driverMock.getRowByKey).toHaveBeenCalledTimes(1);
            expect(driverMock.data).toHaveProperty("test");
            expect(driverMock.data.test).toHaveProperty("sword");
            expect(driverMock.data.test.sword).toEqual("hi");
        });

        test("get_bad_key", async () => {
            expect(db.get({} as any)).rejects.toThrowError(
                "First argument (key) needs to be a string"
            );
        });

        test("get_dot_property_good", async () => {
            driverMock.data = { test: { sword: "hi" } };
            await expect(db.get("test.sword")).resolves.toEqual("hi");
            expect(driverMock.getRowByKey).toHaveBeenCalledWith("json", "test");
            expect(driverMock.getRowByKey).toHaveBeenCalledTimes(1);
        });

        test("set_get_normal_keys", async () => {
            db.useNormalKeys(true);
            await expect(db.set("test.sword", "hi")).resolves.toEqual("hi");
            expect(driverMock.setRowByKey).toHaveBeenCalledTimes(1);
            expect(driverMock.getRowByKey).toHaveBeenCalledTimes(1);
            console.log(driverMock.data);
            expect(driverMock.data).toHaveProperty(["test.sword"]);
            expect(driverMock.data["test.sword"]).toEqual("hi");

            db.useNormalKeys(false);
        });

        test("delete_bad_key", async () => {
            expect(db.delete({} as any)).rejects.toThrowError(
                "First argument (key) needs to be a string"
            );
        });

        test("add_bad_key", async () => {
            expect(db.add({} as any, 10)).rejects.toThrowError(
                "First argument (key) needs to be a string"
            );
        });

        test("add_missing_second_argument", async () => {
            expect(
                db.add("test", null as unknown as number)
            ).rejects.toThrowError("Missing second argument (value)");
            expect(
                db.add("test", undefined as unknown as number)
            ).rejects.toThrowError("Missing second argument (value)");
        });

        test("sub_bad_key", async () => {
            expect(db.sub({} as any, 10)).rejects.toThrowError(
                "First argument (key) needs to be a string"
            );
        });

        test("sub_missing_second_argument", async () => {
            expect(
                db.sub("test", null as unknown as number)
            ).rejects.toThrowError("Missing second argument (value)");
            expect(
                db.sub("test", undefined as unknown as number)
            ).rejects.toThrowError("Missing second argument (value)");
        });

        test("push_not_exists", async () => {
            const settingData = generateTestData(faker.datatype.number);
            for (const data of settingData) {
                await expect(db.push(data.id, data.value)).resolves.toEqual(
                    expect.arrayContaining([data.value])
                );
                expect(driverMock.setRowByKey).toHaveBeenLastCalledWith(
                    "json",
                    data.id,
                    [data.value],
                    false
                );
                expect(driverMock.getRowByKey).toHaveBeenLastCalledWith(
                    "json",
                    data.id
                );
                expect(driverMock.data).toHaveProperty(data.id);
                expect(driverMock.data[data.id]).toEqual(
                    expect.arrayContaining([data.value])
                );
            }
        });
    });

    describe("Test with data", () => {
        let testData;
        beforeEach((done) => {
            testData = injectTestData(faker.name.findName);
            done();
        });

        test("get_exists", async () => {
            for (const data of testData) {
                const result = await db.get(data.id);
                expect(result).toEqual(data.value);
                expect(driverMock.getRowByKey).toHaveBeenLastCalledWith(
                    "json",
                    data.id
                );
            }

            expect(driverMock.getRowByKey).toHaveBeenCalledTimes(
                testData.length
            );
        });

        test("has_exists", async () => {
            for (const data of testData) {
                const result = await db.has(data.id);
                expect(result).toEqual(true);
                expect(driverMock.getRowByKey).toHaveBeenCalledWith(
                    "json",
                    data.id
                );
            }

            expect(driverMock.getRowByKey).toHaveBeenCalledTimes(
                testData.length
            );
        });

        test("all", async () => {
            const results = await db.all();
            expect(results).toHaveLength(testData.length);
            expect(results).toEqual(expect.arrayContaining(testData));
            expect(driverMock.getAllRows).toHaveBeenCalledTimes(1);
        });

        test("delete_exists", async () => {
            const result = await db.delete(testData[0].id);
            expect(result).toEqual(1);
            expect(driverMock.deleteRowByKey).toHaveBeenLastCalledWith(
                "json",
                testData[0].id
            );
            expect(db.has(testData[0].id)).resolves.toEqual(false);
        });

        test("delete_all", async () => {
            const result = await db.deleteAll();
            expect(result).toEqual(testData.length);
            expect(driverMock.deleteAllRows).toHaveBeenCalled();
            expect(db.all()).resolves.toHaveLength(0);
        });
    });

    describe("Test with numbers", () => {
        let testData;
        beforeEach(() => {
            testData = injectTestData(faker.datatype.number);
        });

        test("add_exist_good", async () => {
            for (const data of testData) {
                const toAdd = faker.datatype.number({ min: -100, max: 100 });
                await expect(db.add(data.id, toAdd)).resolves.toEqual(
                    data.value + toAdd
                );
                expect(driverMock.setRowByKey).toHaveBeenLastCalledWith(
                    "json",
                    data.id,
                    data.value + toAdd,
                    true
                );
                expect(driverMock.getRowByKey).toHaveBeenLastCalledWith(
                    "json",
                    data.id
                );
            }
        });

        test("sub_exist_good", async () => {
            for (const data of testData) {
                const toAdd = faker.datatype.number({ min: -100, max: 100 });
                await expect(db.sub(data.id, toAdd)).resolves.toEqual(
                    data.value - toAdd
                );
                expect(driverMock.setRowByKey).toHaveBeenLastCalledWith(
                    "json",
                    data.id,
                    data.value - toAdd,
                    true
                );
                expect(driverMock.getRowByKey).toHaveBeenLastCalledWith(
                    "json",
                    data.id
                );
            }
        });
    });

    describe("Test with arrays", () => {
        let testData;
        beforeEach(() => {
            testData = injectTestData(faker.datatype.array);
        });

        test("push_exists", async () => {
            for (const data of testData) {
                const toPush = faker.datatype.number();
                await expect(db.push(data.id, toPush)).resolves.toEqual(
                    expect.arrayContaining([toPush])
                );
                expect(driverMock.setRowByKey).toHaveBeenLastCalledWith(
                    "json",
                    data.id,
                    expect.arrayContaining([toPush]),
                    true
                );
                expect(driverMock.getRowByKey).toHaveBeenLastCalledWith(
                    "json",
                    data.id
                );
                expect(driverMock.data).toHaveProperty(data.id);
                expect(driverMock.data[data.id]).toEqual(
                    expect.arrayContaining([toPush])
                );
            }
        });

        test("pull_exists", async () => {
            for (const data of testData) {
                await expect(db.pull(data.id, data.value[0])).resolves.toEqual(
                    expect.arrayContaining(data.value.slice(1))
                );
                expect(driverMock.setRowByKey).toHaveBeenLastCalledWith(
                    "json",
                    data.id,
                    data.value.slice(1),
                    true
                );
                expect(driverMock.getRowByKey).toHaveBeenCalledWith(
                    "json",
                    data.id
                );
            }
        });
    });
});
*/
