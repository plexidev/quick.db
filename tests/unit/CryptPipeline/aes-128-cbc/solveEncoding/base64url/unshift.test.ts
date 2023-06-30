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
    solveEncoding: true,
});

const pipeline = new PipeLiner(SQLiteInstance, crypt);
const db = new QuickDB({
    driver: pipeline,
});
db.init();

describe("unshift", () => {
    afterEach(async () => {
        SqliteDriverMock.mockClear();
        await db.deleteAll();
    });

    describe("no initial data", () => {
        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should unshift entry", async () => {
            const entry = EntryGenerator.generateEntry<number>(
                faker.number.int
            );
            const returned = await db.unshift(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual([entry.value]);
            expect(returned).toEqual([entry.value]);
        });

        it("should unshift from object property", async () => {
            const entry = EntryGenerator.generateComplexEntry<number>(
                faker.number.int
            );
            const returned = await db.unshift(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual([entry.value]);

            const obj = {} as any;
            obj[entry.id.split(".")[1]] = [entry.value];
            expect(returned).toEqual(obj);
        });
    });

    describe("with initial data", () => {
        beforeEach(async () => {
            await db.set("test", [5]);
            await db.set("object", { test: [10] });
        });

        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should unshift entry", async () => {
            const returned = await db.unshift("test", 10);
            const result = await db.get("test");
            expect(result).toEqual([10, 5]);
            expect(returned).toEqual([10, 5]);
        });

        it("should unshift from object property", async () => {
            const returned = await db.unshift("object.test", 5);
            const result = await db.get("object.test");
            expect(result).toEqual([5, 10]);
            expect(returned).toEqual({ test: [5, 10] });
        });
    });
});
