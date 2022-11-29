import { QuickDB } from "../src";
import { EntryGenerator } from "./generators/EntryGenerator";
import { faker } from "@faker-js/faker";
import { SqliteDriverMock } from "./mocks/SqliteDriver";

const db = new QuickDB({
    driver: new SqliteDriverMock("test.sqlite"),
});

describe("push", () => {
    afterEach(async () => {
        SqliteDriverMock.mockClear();
        await db.deleteAll();
    });

    describe("no initial data", () => {
        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should push string", async () => {
            const entry = EntryGenerator.generateEntry<string>(
                faker.datatype.string
            );
            await db.push(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual([entry.value]);
        });

        it("should push number", async () => {
            const entry = EntryGenerator.generateEntry<number>(
                faker.datatype.number
            );
            await db.push(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual([entry.value]);
        });

        it("should push boolean", async () => {
            const entry = EntryGenerator.generateEntry<boolean>(
                faker.datatype.boolean
            );
            await db.push(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual([entry.value]);
        });

        it("should push object of string", async () => {
            const entry = EntryGenerator.generateComplexEntry<string>(
                faker.datatype.string
            );
            await db.push(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual([entry.value]);
        });

        it("should push array of string", async () => {
            const entry = EntryGenerator.generateEntry<string>(
                faker.datatype.string
            );
            entry.value = [entry.value] as any;
            await db.push(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual([entry.value]);
        });
    });

    describe("with initial data", () => {
        beforeEach(async () => {
            await db.set("test", [5]);
            await db.set("object", [{ test: 10 }]);
        });

        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should push entry", async () => {
            await db.push("test", 5);
            const result = await db.get("test");
            expect(result).toEqual([5, 5]);
        });

        it("should push entry convert object to array", async () => {
            await db.push("object", { test: 10 });
            const result = await db.get("object");
            expect(result).toEqual([{ test: 10 }, { test: 10 }]);
        });
    });
});
