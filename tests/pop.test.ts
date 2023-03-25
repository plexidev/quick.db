import { QuickDB } from "../src";
import { EntryGenerator } from "./generators/EntryGenerator";
import { faker } from "@faker-js/faker";
import { SqliteDriverMock } from "./mocks/SqliteDriver";

const db = new QuickDB({
    driver: new SqliteDriverMock("test.sqlite"),
});

describe("pop", () => {
    afterEach(async () => {
        SqliteDriverMock.mockClear();
        await db.deleteAll();
    });

    describe("no initial data", () => {
        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should pop entry no data return undefined", async () => {
            const entry = EntryGenerator.generateEntry<number>(
                faker.datatype.number
            );
            const returned = await db.pop(entry.id);
            expect(returned).toEqual(undefined);
        });
    });

    describe("with initial data", () => {
        beforeEach(async () => {
            await db.set("test", [5, 6]);
            await db.set("object", { test: [10, 19] });
        });

        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should pop entry", async () => {
            const returned = await db.pop("test");
            const result = await db.get("test");
            expect(result).toEqual([5]);
            expect(returned).toEqual(6);
        });

        it("should pop from object property", async () => {
            const returned = await db.pop("object.test");
            const result = await db.get("object.test");
            expect(result).toEqual([10]);
            expect(returned).toEqual(19);
        });
    });
});
