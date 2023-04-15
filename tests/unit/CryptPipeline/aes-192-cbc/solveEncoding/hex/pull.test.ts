import { PipeLiner, QuickDB } from "../../../../../../src";
import { EntryGenerator } from "../../../../../generators/EntryGenerator";
import { faker } from "@faker-js/faker";
import { SqliteDriverMock } from "../../../../../mocks/SqliteDriver";
import { CryptPipeline } from "../../../../../../src/pipeline/crypto/crypt";
import { randomBytes } from "crypto";

const SQLiteInstance = new SqliteDriverMock("test.sqlite");
const key = randomBytes(12).toString('hex');
const crypt = new CryptPipeline({
	algorithm: "aes-192-cbc",
	key: key,
	encoding: "hex",
	solveEncoding: true
});

const pipeline = new PipeLiner(SQLiteInstance, crypt);
const db = new QuickDB({
    driver: pipeline,
});
db.init();


describe("pull", () => {
    afterEach(async () => {
        SqliteDriverMock.mockClear();
        await db.deleteAll();
    });

    describe("no initial data", () => {
        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should pull empty array", async () => {
            const entry = EntryGenerator.generateEntry<string>(
                faker.datatype.string
            );
            const returned = await db.pull(entry.id, entry.value);
            expect(returned).toEqual([]);
        });

        it("should pull empty array - array", async () => {
            const entry = EntryGenerator.generateEntry<string>(
                faker.datatype.string
            );
            const returned = await db.pull(entry.id, [entry.value]);
            expect(returned).toEqual([]);
        });

        it("should pull empty array - function", async () => {
            const entry = EntryGenerator.generateEntry<string>(
                faker.datatype.string
            );
            const returned = await db.pull(
                entry.id,
                (el: any) => el == entry.value
            );
            expect(returned).toEqual([]);
        });
    });

    describe("with initial data", () => {
        beforeEach(async () => {
            await db.set("test", [5, 10, 11]);
            await db.set("object", [{ test: 10 }, { test: 15 }]);
            await db.set("objectProp", { test: [10, 20] });
        });

        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        // TODO: pull should return a removed array not the current data
        it("should pull entry", async () => {
            const returned = await db.pull("test", 10);
            const result = await db.get("test");
            expect(result).toEqual([5, 11]);
            expect(returned).toEqual([5, 11]);
        });

        it("should pull entries array", async () => {
            const returned = await db.pull("test", [5, 11]);
            const result = await db.get("test");
            expect(result).toEqual([10]);
            expect(returned).toEqual([10]);
        });

        // TODO: should also verify for props giving to the function (those may be important)
        it("should pull object from array - function", async () => {
            const returned = await db.pull(
                "object",
                (el: any) => el.test == 15
            );
            const result = await db.get("object");
            expect(result).toEqual([{ test: 10 }]);
            expect(returned).toEqual([{ test: 10 }]);
        });

        it("should pull entry from object prop", async () => {
            const returned = await db.pull("objectProp.test", 10);
            const result = await db.get("objectProp");
            expect(result).toEqual({ test: [20] });
            expect(returned).toEqual({ test: [20] });
        });
    });
});
