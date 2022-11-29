import faker from "@faker-js/faker";
import { QuickDB } from "../src";
import { EntryGenerator } from "./generators/EntryGenerator";
import { DatabaseStub } from "./stubs/DatabaseStub";
import { driverMock } from "./stubs/DriverStub";

function testNormalEntry(
    driverMock,
    result,
    entry,
    update = false,
    resultt = 0
) {
    expect(result).toEqual(resultt);
    expect(driverMock.setRowByKey).toHaveBeenLastCalledWith(
        "json",
        entry.id,
        resultt,
        update
    );
    expect(driverMock.getRowByKey).toHaveBeenLastCalledWith("json", entry.id);
    const data = DatabaseStub.extractTable("json");
    expect(data).toHaveProperty(entry.id);
    expect(data[entry.id]).toStrictEqual(resultt);
}

function testComplexEntry(
    driverMock,
    result,
    entry,
    update = false,
    resultt = 0
) {
    const splitId = entry.id.split(".");
    const madeUpObject = {};
    madeUpObject[splitId[1]] = resultt;
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
    expect(data[splitId[0]][splitId[1]]).toStrictEqual(resultt);
}

const db = new QuickDB({ driver: driverMock });
describe("Sub test no value in db", () => {
    afterEach(() => {
        jest.clearAllMocks();
        DatabaseStub.insertTable("json"); // Reset database
    });

    test("sub_numebr_number", async () => {
        const testEntries = EntryGenerator.generateEntries<number>(
            faker.datatype.number
        );
        for (const entry of testEntries) {
            const sub = await db.sub(entry.id, entry.value);
            testNormalEntry(driverMock, sub, entry, false, 0 - entry.value);
        }
    });

    test("sub_numebr_objectNumber", async () => {
        const testEntries = EntryGenerator.generateComplexEntries<number>(
            faker.datatype.number
        );

        for (const entry of testEntries) {
            const sub = await db.sub(entry.id, entry.value);
            testComplexEntry(driverMock, sub, entry, false, 0 - entry.value);
        }
    });
});

describe("Sub test with number value", () => {
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
            const sub = await db.sub(entry.id, entry.value);
            trackOfAdd -= entry.value;
            entry.value = trackOfAdd;
            expect(sub).toEqual(trackOfAdd);
            testNormalEntry(driverMock, trackOfAdd, entry, true, trackOfAdd);
        }
    });

    test("add_number_objectNumber", async () => {
        let trackOfAdd = 10;
        const testEntries = EntryGenerator.generateEntries<number>(
            faker.datatype.number
        );
        for (const entry of testEntries) {
            entry.id = "object.num";
            const sub = await db.sub(entry.id, entry.value);
            trackOfAdd -= entry.value;
            entry.value = trackOfAdd;
            expect(sub).toEqual(trackOfAdd);
            testComplexEntry(driverMock, trackOfAdd, entry, true, trackOfAdd);
        }
    });
});
