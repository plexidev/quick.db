import { PipeLiner, QuickDB } from "../../../../../../src";
import { EntryGenerator } from "../../../../../generators/EntryGenerator";
import { faker } from "@faker-js/faker";
import { SqliteDriverMock } from "../../../../../mocks/SqliteDriver";
import { CryptPipeline } from "../../../../../../src/pipeline/crypto/crypt";
import { randomBytes } from "crypto";

const SQLiteInstance = new SqliteDriverMock("test.sqlite");
const key = randomBytes(8).toString('hex');
const crypt = new CryptPipeline({
	algorithm: "aes-128-cbc",
	key: key,
	encoding: "hex",
	solveEncoding: true
});

const pipeline = new PipeLiner(SQLiteInstance, crypt);
const db = new QuickDB({
    driver: pipeline,
});
db.init();

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
