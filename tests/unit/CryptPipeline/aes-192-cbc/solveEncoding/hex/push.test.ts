import { PipeLiner, QuickDB } from "../../../../../../src";
import { EntryGenerator } from "../../../../../generators/EntryGenerator";
import { faker } from "@faker-js/faker";
import { SqliteDriverMock } from "../../../../../mocks/SqliteDriver";
import { CryptPipeline } from "../../../../../../src/pipeline/crypto/crypt";
import { randomBytes } from "crypto";

const SQLiteInstance = new SqliteDriverMock("test.sqlite");
const key = randomBytes(12).toString("hex");
const crypt = new CryptPipeline({
    algorithm: "aes-192-cbc",
    key: key,
    encoding: "hex",
    solveEncoding: true,
});

const pipeline = new PipeLiner(SQLiteInstance, crypt);
const db = new QuickDB({
    driver: pipeline,
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
                faker.string.sample
            );
            const returned = await db.push(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual([entry.value]);
            expect(returned).toEqual([entry.value]);
        });

        it("should push number", async () => {
            const entry = EntryGenerator.generateEntry<number>(
                faker.number.int
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
                faker.string.sample
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
                faker.string.sample
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
                faker.number.int
            );
            const returned = await db.push("test", entry.value);
            const result = await db.get("test");
            expect(result).toEqual([5, entry.value]);
            expect(returned).toEqual([5, entry.value]);
        });

        it("should push object in array", async () => {
            const entry = EntryGenerator.generateEntry<string>(
                faker.string.sample
            );
            entry.value = { test: entry.value } as any;
            const returned = await db.push("object", entry.value);
            const result = await db.get("object");
            expect(result).toEqual([{ test: 10 }, entry.value]);
            expect(returned).toEqual([{ test: 10 }, entry.value]);
        });

        it("should push object in object", async () => {
            const entry = EntryGenerator.generateEntry<string>(
                faker.string.sample
            );
            entry.value = { test: entry.value } as any;
            const returned = await db.push("objectProp.test", entry.value);
            const result = await db.get("objectProp.test");
            expect(result).toEqual([10, entry.value]);
            expect(returned).toEqual({ test: [10, entry.value] });
        });
    });
});
