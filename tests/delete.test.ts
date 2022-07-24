import { QuickDB } from "../src";
import { driverMock } from "./stubs/DriverStub";
import { DatabaseStub } from "./stubs/DatabaseStub";
import { EntryGenerator } from "./generators/EntryGenerator";
import faker from "@faker-js/faker";
// TODO: check for errors as well in all testes files
function testNormalEntry(driverMock, entry) {
    expect(driverMock.deleteRowByKey).toHaveBeenLastCalledWith(
        "json",
        entry.id
    );
    const data = DatabaseStub.extractTable("json");
    expect(data[entry.id]).toEqual(undefined);
}

function testComplexEntry(driverMock, entry) {
    const splitId = entry.id.split(".");
    expect(driverMock.setRowByKey).toHaveBeenLastCalledWith(
        "json",
        splitId[0],
        {},
        true
    );
    const data = DatabaseStub.extractTable("json");
    expect(data[splitId[0]][splitId[1]]).toEqual(undefined);
}

const db = new QuickDB({ driver: driverMock });
describe("Get", () => {
    afterEach(() => {
        jest.clearAllMocks();
        DatabaseStub.insertTable("json");
    });

    test("delete_entryStrings_undefined", async () => {
        const testEntries = EntryGenerator.generateEntries<string>();
        DatabaseStub.injectEntries("json", testEntries); // inject data in db
        for (const entry of testEntries) {
            await db.delete(entry.id);
            testNormalEntry(driverMock, entry);
        }
    });

    test("delete_complexEntryStrings_undefined", async () => {
        const testEntries = EntryGenerator.generateComplexEntries<string>();
        DatabaseStub.injectEntries("json", testEntries, true); // inject data in db
        for (const entry of testEntries) {
            await db.delete(entry.id);
            testComplexEntry(driverMock, entry);
        }
    });
});
