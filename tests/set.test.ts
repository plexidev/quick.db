import { QuickDB } from "../src";
import { EntryGenerator } from "./generators/EntryGenerator";
import { faker } from "@faker-js/faker";
import { SqliteDriverMock } from "./mocks/SqliteDriver";

const db = new QuickDB({
    driver: new SqliteDriverMock("test.sqlite"),
});

describe("set", () => {
    afterEach(async () => {
        SqliteDriverMock.mockClear();
        await db.deleteAll();
    });

    describe("no initial data", () => {
        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should set string", async () => {
            const entry = EntryGenerator.generateEntry<string>();
            await db.set(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toBe(entry.value);
        });

        it("should set number", async () => {
            const entry = EntryGenerator.generateEntry<number>(
                faker.datatype.number
            );
            await db.set(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toBe(entry.value);
        });

        it("should set boolean", async () => {
            const entry = EntryGenerator.generateEntry<boolean>(
                faker.datatype.boolean
            );
            await db.set(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toBe(entry.value);
        });

        it("should set object of string", async () => {
            const entry = EntryGenerator.generateEntry<string>(
                faker.datatype.string
            );
            await db.set(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual(entry.value);
        });

        it("should set array of string", async () => {
            const entry = EntryGenerator.generateEntry<string>(
                faker.datatype.string
            );
            await db.set(entry.id, [entry.value]);
            const result = await db.get(entry.id);
            expect(result).toEqual([entry.value]);
        });
    });

    describe("with initial data", () => {
        beforeEach(async () => {
            await db.set("string", "string");
            await db.set("number", 1);
            await db.set("boolean", true);
            await db.set("object", { key: "value" });
            await db.set("array", ["value"]);
        });

        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should set string", async () => {
            await db.set("string", "other string");
            const result = await db.get("string");
            expect(result).toBe("other string");
        });

        it("should set number", async () => {
            await db.set("number", 2);
            const result = await db.get("number");
            expect(result).toBe(2);
        });

        it("should set boolean", async () => {
            await db.set("boolean", false);
            const result = await db.get("boolean");
            expect(result).toBe(false);
        });

        it("should set object of string", async () => {
            await db.set("object", { key: "other value" });
            const result = await db.get("object");
            expect(result).toEqual({ key: "other value" });
        });

        it("should set array of string", async () => {
            await db.set("array", ["other value"]);
            const result = await db.get("array");
            expect(result).toEqual(["other value"]);
        });
    });
});
