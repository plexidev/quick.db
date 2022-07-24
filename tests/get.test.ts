import { QuickDB } from "../src";
import { driverMock } from "./stubs/DriverStub";
import { DatabaseStub } from "./stubs/DatabaseStub";
import { EntryGenerator } from "./generators/EntryGenerator";
import faker from "@faker-js/faker";
// TODO: check for errors as well in all testes files
function testNormalEntry(driverMock, result, entry) {
    expect(result).toEqual(entry.value);
    expect(driverMock.getRowByKey).toHaveBeenLastCalledWith("json", entry.id);
    const data = DatabaseStub.extractTable("json");
    expect(data).toHaveProperty(entry.id);
    expect(data[entry.id]).toStrictEqual(entry.value);
}

function testComplexEntry(driverMock, result, entry) {
    const splitId = entry.id.split(".");
    expect(result).toEqual(entry.value);
    expect(driverMock.getRowByKey).toHaveBeenLastCalledWith("json", splitId[0]);
    const data = DatabaseStub.extractTable("json");
    expect(data).toHaveProperty(entry.id);
    expect(data[splitId[0]][splitId[1]]).toStrictEqual(entry.value);
}

const db = new QuickDB({ driver: driverMock });
describe("Get", () => {
    afterEach(() => {
        jest.clearAllMocks();
        DatabaseStub.insertTable("json");
    });

    test("get_entryStrings_string", async () => {
        const testEntries = EntryGenerator.generateEntries<string>();
        DatabaseStub.injectEntries("json", testEntries); // inject data in db
        for (const entry of testEntries) {
            const got = await db.get(entry.id);
            testNormalEntry(driverMock, got, entry);
        }
    });

    test("get_entryNumbers_number", async () => {
        const testEntries = EntryGenerator.generateEntries<number>(
            faker.datatype.number
        );
        DatabaseStub.injectEntries("json", testEntries); // inject data in db
        for (const entry of testEntries) {
            const got = await db.get(entry.id);
            testNormalEntry(driverMock, got, entry);
        }
    });

    test("get_entryArrays_array", async () => {
        const testEntries = EntryGenerator.generateEntries<any[]>(
            faker.datatype.array
        );
        DatabaseStub.injectEntries("json", testEntries); // inject data in db
        for (const entry of testEntries) {
            const got = await db.get(entry.id);
            testNormalEntry(driverMock, got, entry);
        }
    });

    test("get_entryObjects_object", async () => {
        const testEntries = EntryGenerator.generateEntries<string>();
        testEntries.map((entry) => ({
            id: entry.id,
            value: { test: entry.value },
        })); // Note: may have to change
        DatabaseStub.injectEntries("json", testEntries); // inject data in db
        for (const entry of testEntries) {
            const got = await db.get(entry.id);
            testNormalEntry(driverMock, got, entry);
        }
    });

    test("get_complexEntryStrings_string", async () => {
        const testEntries = EntryGenerator.generateComplexEntries<string>();
        DatabaseStub.injectEntries("json", testEntries, true); // inject data in db
        for (const entry of testEntries) {
            const got = await db.get(entry.id);
            testComplexEntry(driverMock, got, entry);
        }
    });
});
