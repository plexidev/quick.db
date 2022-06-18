import { QuickDB } from "../src";
import { driverMock } from "./stubs/DriverStub";
import { DatabaseStub } from "./stubs/DatabaseStub";
import { EntryGenerator } from "./generators/EntryGenerator";
import faker from "@faker-js/faker";

function testNormalEntry(driverMock, result, entry) {
    expect(result).toEqual(entry.value);
    expect(driverMock.setRowByKey).toHaveBeenLastCalledWith(
        "json",
        entry.id,
        entry.value,
        false
    );
    expect(driverMock.getRowByKey).toHaveBeenLastCalledWith("json", entry.id);
    const data = DatabaseStub.extractTable("json");
    expect(data).toHaveProperty(entry.id);
    expect(data[entry.id]).toStrictEqual(entry.value);
}

const db = new QuickDB({ driver: driverMock });
describe("Set", () => {
    afterEach(() => {
        jest.clearAllMocks();
        DatabaseStub.insertTable("json");
    });

    describe("Empty Database", () => {
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
    });
});
