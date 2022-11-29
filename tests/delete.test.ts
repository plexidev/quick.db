import { QuickDB } from "../src";
import { EntryGenerator } from "./generators/EntryGenerator";
import { faker } from "@faker-js/faker";
import { SqliteDriverMock } from "./mocks/SqliteDriver";

const db = new QuickDB({
    driver: new SqliteDriverMock("test.sqlite"),
});

describe("delete", () => {
    afterEach(async () => {
        SqliteDriverMock.mockClear();
        await db.deleteAll();
    });

    describe("no initial data", () => {
        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should delete entry", async () => {
            const entry = EntryGenerator.generateEntry<string>();
            await db.set(entry.id, entry.value);
            await db.delete(entry.id);
            const result = await db.get(entry.id);
            expect(result).toBeNull();
        });
    });

    describe("with initial data", () => {
        beforeAll(async () => {
            await db.set("test", "test");
            await db.set("object", { test: "test", other: "other" });
        });

        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should delete entry", async () => {
            await db.delete("test");
            const result = await db.get("test");
            expect(result).toBeNull();
        });

        // it("should delete object property", async () => {
        //     await db.delete("object.test");
        //     const result = await db.get("object");
        //     expect(result).toEqual({ other: "other" });
        // });
    });
});
