import { QuickDB } from "../src";
import { driverMock } from "./stubs/DriverStub";
import { DatabaseStub } from "./stubs/DatabaseStub";
import { EntryGenerator } from "./generators/EntryGenerator";
import faker from "@faker-js/faker";

function testNormalEntry(driverMock, result, entry, update = false) {
    expect(result).toEqual(entry.value);
    expect(driverMock.setRowByKey).toHaveBeenLastCalledWith(
        "json",
        entry.id,
        entry.value,
        update
    );
    expect(driverMock.getRowByKey).toHaveBeenLastCalledWith("json", entry.id);
    const data = DatabaseStub.extractTable("json");
    expect(data).toHaveProperty(entry.id);
    expect(data[entry.id]).toStrictEqual(entry.value);
}

function testComplexEntry(driverMock, result, entry, update = false) {
    const splitId = entry.id.split(".");
    const madeUpObject = {};
    madeUpObject[splitId[1]] = entry.value;
    expect(result).toEqual(madeUpObject);
    expect(driverMock.setRowByKey).toHaveBeenLastCalledWith(
        "json",
        splitId[0],
        madeUpObject,
        update
    );
    expect(driverMock.getRowByKey).toHaveBeenLastCalledWith("json", splitId[0]);
    const data = DatabaseStub.extractTable("json");

    expect(data).toHaveProperty(splitId[0]);
    expect(data[splitId[0]]).toHaveProperty(splitId[1]);
    expect(data[splitId[0]][splitId[1]]).toStrictEqual(entry.value);
}

// TODO: may rewrite this to make it looping
function testDeepComplexEntry(driverMock, result, entry, update = false) {
    const splitId = entry.id.split(".");
    const madeUpObject = {};
    madeUpObject[splitId[1]] = {};
    madeUpObject[splitId[1]][splitId[2]] = entry.value;
    expect(result).toEqual(madeUpObject);
    expect(driverMock.setRowByKey).toHaveBeenLastCalledWith(
        "json",
        splitId[0],
        madeUpObject,
        update
    );
    expect(driverMock.getRowByKey).toHaveBeenLastCalledWith("json", splitId[0]);
    const data = DatabaseStub.extractTable("json");

    expect(data).toHaveProperty(splitId[0]);
    expect(data[splitId[0]]).toHaveProperty(splitId[1]);
    expect(data[splitId[0]][splitId[1]]).toHaveProperty(splitId[2]);
    expect(data[splitId[0]][splitId[1]][splitId[2]]).toStrictEqual(entry.value);
}

const db = new QuickDB({ driver: driverMock });
// TODO: make set tests for error (do custom errors before)
describe("Set no overwrite", () => {
    afterEach(() => {
        jest.clearAllMocks();
        DatabaseStub.insertTable("json"); // Reset database
    });

    test("set_entryStrings_string", async () => {
        const testEntries = EntryGenerator.generateEntries<string>();
        for (const entry of testEntries) {
            const setted = await db.set(entry.id, entry.value);
            testNormalEntry(driverMock, setted, entry);
        }
    });

    test("set_entryNumbers_number", async () => {
        const testEntries = EntryGenerator.generateEntries<number>(
            faker.datatype.number
        );
        for (const entry of testEntries) {
            const setted = await db.set(entry.id, entry.value);
            testNormalEntry(driverMock, setted, entry);
        }
    });

    test("set_entryArrays_array", async () => {
        const testEntries = EntryGenerator.generateEntries<any[]>(
            faker.datatype.array
        );
        for (const entry of testEntries) {
            const setted = await db.set(entry.id, entry.value);
            testNormalEntry(driverMock, setted, entry);
        }
    });

    test("set_entryObjects_object", async () => {
        const testEntries = EntryGenerator.generateEntries<string>();
        testEntries.map((entry) => ({
            id: entry.id,
            value: { test: entry.value },
        })); // Note: may have to change
        for (const entry of testEntries) {
            const setted = await db.set(entry.id, entry.value);
            testNormalEntry(driverMock, setted, entry);
        }
    });

    test("set_complexEntryStrings_string", async () => {
        const testEntries = EntryGenerator.generateComplexEntries<string>();
        for (const entry of testEntries) {
            const setted = await db.set(entry.id, entry.value);
            testComplexEntry(driverMock, setted, entry);
        }
    });

    test("set_deepComplexEntryStrings_string", async () => {
        const testEntries = EntryGenerator.generateDeepComplexEntries<string>();
        for (const entry of testEntries) {
            const setted = await db.set(entry.id, entry.value);
            testDeepComplexEntry(driverMock, setted, entry);
        }
    });
});

describe("Set overwriting", () => {
    beforeAll(async () => {
        jest.clearAllMocks();
        DatabaseStub.insertTable("json");
        DatabaseStub.insert("json", "value", 10);
        DatabaseStub.insert("json", "array", [10]);
        DatabaseStub.insert("json", "object", { t: 10 });
    });

    test("set_overwriteValue_value", async () => {
        const test = EntryGenerator.generateEntries<string>(undefined, 1);
        test[0].id = "value";
        const setted = await db.set(test[0].id, test[0].value);
        testNormalEntry(driverMock, setted, test[0], true);
    });

    test("set_overwriteArray_value", async () => {
        const test = EntryGenerator.generateEntries<string>(undefined, 1);
        test[0].id = "array";
        const setted = await db.set(test[0].id, test[0].value);
        testNormalEntry(driverMock, setted, test[0], true);
    });

    test("set_overwriteObject_value", async () => {
        const test = EntryGenerator.generateEntries<string>(undefined, 1);
        test[0].id = "object";
        const setted = await db.set(test[0].id, test[0].value);
        testNormalEntry(driverMock, setted, test[0], true);
    });
});
