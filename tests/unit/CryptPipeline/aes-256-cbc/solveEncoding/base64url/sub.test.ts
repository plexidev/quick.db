import { PipeLiner, QuickDB } from "../../../../../../src";
import { EntryGenerator } from "../../../../../generators/EntryGenerator";
import { faker } from "@faker-js/faker";
import { SqliteDriverMock } from "../../../../../mocks/SqliteDriver";
import { CryptPipeline } from "../../../../../../src/pipeline/crypto/crypt";
import { randomBytes } from "crypto";

const SQLiteInstance = new SqliteDriverMock("test.sqlite");
const key = randomBytes(16).toString("hex");
const crypt = new CryptPipeline({
    algorithm: "aes-256-cbc",
    key: key,
    encoding: "base64url",
    solveEncoding: true,
});

const pipeline = new PipeLiner(SQLiteInstance, crypt);
const db = new QuickDB({
    driver: pipeline,
});
db.init();

describe("sub", () => {
    afterEach(async () => {
        SqliteDriverMock.mockClear();
        await db.deleteAll();
    });

    describe("no initial data", () => {
        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should subtract entry", async () => {
            const entry = EntryGenerator.generateEntry<number>(
                faker.number.int
            );
            const returned = await db.sub(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual(-entry.value);
            expect(returned).toEqual(-entry.value);
        });

        it("should subtract entry convert string to number", async () => {
            const entry = EntryGenerator.generateEntry<number>(
                faker.number.int
            );
            entry.value = entry.value.toString() as any;
            const returned = await db.sub(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual(-Number(entry.value));
            expect(returned).toEqual(-Number(entry.value));
        });

        it("should subtract from object property", async () => {
            const entry = EntryGenerator.generateComplexEntry<number>(
                faker.number.int
            );
            const returned = await db.sub(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual(-entry.value);
            expect(returned).toEqual(-entry.value);
        });
    });

    describe("with initial data", () => {
        beforeEach(async () => {
            await db.set("test", 5);
            await db.set("string", "5");
            await db.set("object", { test: 10 });
        });

        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should subtract entry", async () => {
            const returned = await db.sub("test", 5);
            const result = await db.get("test");
            expect(result).toEqual(0);
            expect(returned).toEqual(0);
        });

        it("should subtract entry convert string to number", async () => {
            const returned = await db.sub("string", 5);
            const result = await db.get("string");
            expect(result).toEqual(0);
            expect(returned).toEqual(0);
        });

        it("should subtract entry convert string to number with db string", async () => {
            const returned = await db.sub("string", "5" as any);
            const result = await db.get("string");
            expect(result).toEqual(0);
            expect(returned).toEqual(0);
        });

        it("should subtract from object property", async () => {
            const returned = await db.sub("object.test", 5);
            const result = await db.get("object");
            expect(result).toEqual({ test: 5 });
            expect(returned).toEqual(5);
        });
    });
});
