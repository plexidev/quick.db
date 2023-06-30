import { PipeLiner, QuickDB } from "../../../../../../src";
import { EntryGenerator } from "../../../../../generators/EntryGenerator";
import { faker } from "@faker-js/faker";
import { SqliteDriverMock } from "../../../../../mocks/SqliteDriver";
import { CryptPipeline } from "../../../../../../src/pipeline/crypto/crypt";
import { randomBytes } from "crypto";

const SQLiteInstance = new SqliteDriverMock("test.sqlite");
const key = randomBytes(8).toString("hex");
const crypt = new CryptPipeline({
    algorithm: "aes-128-cbc",
    key: key,
    encoding: "base64url",
    solveEncoding: false,
});

const pipeline = new PipeLiner(SQLiteInstance, crypt);
const db = new QuickDB({
    driver: pipeline,
});
db.init();

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
            const entry = EntryGenerator.generateEntry<string>(
                faker.string.sample
            );
            const returned = await db.set(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toBe(entry.value);
            expect(returned).toBe(entry.value);
        });

        it("should set number", async () => {
            const entry = EntryGenerator.generateEntry<number>(
                faker.number.int
            );
            const returned = await db.set(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toBe(entry.value);
            expect(returned).toBe(entry.value);
        });

        it("should set boolean", async () => {
            const entry = EntryGenerator.generateEntry<boolean>(
                faker.datatype.boolean
            );
            const returned = await db.set(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toBe(entry.value);
            expect(returned).toBe(entry.value);
        });

        it("should set object of string", async () => {
            const entry = EntryGenerator.generateComplexEntry<string>(
                faker.string.sample
            );
            const returned = (await db.set(entry.id, entry.value)) as any;
            const result = (await db.get(entry.id)) as any;
            expect(result).toEqual(entry.value);
            expect(result[Object.keys(result)[0]]).toBe(
                (entry.value as any)[Object.keys(result)[0]]
            );

            const obj = {} as any;
            obj[entry.id.split(".")[1]] = entry.value;
            expect(returned).toEqual(obj);
        });

        it("should set array of string", async () => {
            const entry = EntryGenerator.generateEntry<string>(
                faker.string.sample
            );
            const returned = await db.set(entry.id, [entry.value]);
            const result = await db.get(entry.id);
            expect(result).toEqual([entry.value]);
            expect(returned).toEqual([entry.value]);
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
            const returned = await db.set("string", "other string");
            const result = await db.get("string");
            expect(result).toBe("other string");
            expect(returned).toBe("other string");
        });

        it("should set number", async () => {
            const returned = await db.set("number", 2);
            const result = await db.get("number");
            expect(result).toBe(2);
            expect(returned).toBe(2);
        });

        it("should set boolean", async () => {
            const returned = await db.set("boolean", false);
            const result = await db.get("boolean");

            expect(result).toBe(false);
            expect(returned).toBe(false);
        });

        it("should set object of string", async () => {
            const returned = await db.set("object", { key: "other value" });
            const result = await db.get("object");
            expect(result).toEqual({ key: "other value" });
            expect(returned).toEqual({ key: "other value" });
        });

        it("should set array of string", async () => {
            const returned = await db.set("array", ["other value"]);
            const result = await db.get("array");
            expect(result).toEqual(["other value"]);
            expect(returned).toEqual(["other value"]);
        });
    });
});
