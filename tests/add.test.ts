import faker from "@faker-js/faker";
import { QuickDB } from "../src";
import { EntryGenerator } from "./generators/EntryGenerator";
import { DatabaseStub } from "./stubs/DatabaseStub";
import { driverMock } from "./stubs/DriverStub";

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

const db = new QuickDB({ driver: driverMock });
describe("Add test no value in db", () => {
    afterEach(() => {
        jest.clearAllMocks();
        DatabaseStub.insertTable("json"); // Reset database
    });

    test("add_numebr_number", async () => {
        const testEntries = EntryGenerator.generateEntries<number>(
            faker.datatype.number
        );
        for (const entry of testEntries) {
            const added = await db.add(entry.id, entry.value);
            testNormalEntry(driverMock, added, entry);
        }
    });

    test("add_numebr_objectNumber", async () => {
        const testEntries = EntryGenerator.generateComplexEntries<number>(
            faker.datatype.number
        );

        for (const entry of testEntries) {
            const added = await db.add(entry.id, entry.value);
            testComplexEntry(driverMock, added, entry);
        }
    });
});

describe("Add test with number value", () => {
    beforeEach(() => {
        // TODO: this should be to change in the feature
        // it shouldn't be hardcoded
        DatabaseStub.insert("json", "value", 10);
        DatabaseStub.insert("json", "object", { num: 10 });
    });

    afterEach(() => {
        jest.clearAllMocks();
        DatabaseStub.insertTable("json"); // Reset database
    });

    test("add_numebr_number", async () => {
        let trackOfAdd = 10;
        const testEntries = EntryGenerator.generateEntries<number>(
            faker.datatype.number
        );
        for (const entry of testEntries) {
            entry.id = "value"; // TODO: should make something for this
            const added = await db.add(entry.id, entry.value);
            trackOfAdd += entry.value;
            entry.value = trackOfAdd;
            expect(added).toEqual(trackOfAdd);
            testNormalEntry(driverMock, trackOfAdd, entry, true);
        }
    });

    test("add_number_objectNumber", async () => {
        let trackOfAdd = 10;
        const testEntries = EntryGenerator.generateEntries<number>(
            faker.datatype.number
        );
        for (const entry of testEntries) {
            entry.id = "object.num";
            const added = await db.add(entry.id, entry.value);
            trackOfAdd += entry.value;
            entry.value = trackOfAdd;
            expect(added).toEqual(trackOfAdd);
            testComplexEntry(driverMock, trackOfAdd, entry, true);
        }
    });
});
