import { QuickDB } from "../../src";
import { EntryGenerator } from "../generators/EntryGenerator";
import { faker } from "@faker-js/faker";
import { SqliteDriverMock } from "../mocks/SqliteDriver";

const db = new QuickDB({
    driver: new SqliteDriverMock("test.sqlite"),
});
db.init();

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
            const returned = await db.push(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual([entry.value]);
            expect(returned).toEqual([entry.value]);
        });

        it("should push number", async () => {
            const entry = EntryGenerator.generateEntry<number>(
                faker.datatype.number
            );
            const returned = await db.push(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual([entry.value]);
            expect(returned).toEqual([entry.value]);
        });

        it("should push boolean", async () => {
            const entry = EntryGenerator.generateEntry<boolean>(
                faker.datatype.boolean
            );
            const returned = await db.push(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual([entry.value]);
            expect(returned).toEqual([entry.value]);
        });

        it("should push object of string", async () => {
            const entry = EntryGenerator.generateComplexEntry<string>(
                faker.datatype.string
            );
            const returned = await db.push(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual([entry.value]);

            const obj = {} as any;
            obj[entry.id.split(".")[1]] = [entry.value];
            expect(returned).toEqual(obj);
        });

        it("should push array of string", async () => {
            const entry = EntryGenerator.generateEntry<string>(
                faker.datatype.string
            );
            entry.value = [entry.value] as any;
            const returned = await db.push(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual([entry.value]);
            expect(returned).toEqual([entry.value]);
        });
    });

    describe("with initial data", () => {
        beforeEach(async () => {
            await db.set("test", [5]);
            await db.set("object", [{ test: 10 }]);
            await db.set("objectProp", { test: [10] });
        });

        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should push entry", async () => {
            const entry = EntryGenerator.generateEntry<number>(
                faker.datatype.number
            );
            const returned = await db.push("test", entry.value);
            const result = await db.get("test");
            expect(result).toEqual([5, entry.value]);
            expect(returned).toEqual([5, entry.value]);
        });

        it("should push object in array", async () => {
            const entry = EntryGenerator.generateEntry<string>(
                faker.datatype.string
            );
            entry.value = { test: entry.value } as any;
            const returned = await db.push("object", entry.value);
            const result = await db.get("object");
            expect(result).toEqual([{ test: 10 }, entry.value]);
            expect(returned).toEqual([{ test: 10 }, entry.value]);
        });

        it("should push object in object", async () => {
            const entry = EntryGenerator.generateEntry<string>(
                faker.datatype.string
            );
            entry.value = { test: entry.value } as any;
            const returned = await db.push("objectProp.test", entry.value);
            const result = await db.get("objectProp.test");
            expect(result).toEqual([10, entry.value]);
            expect(returned).toEqual({ test: [10, entry.value] });
        });
    });
});
