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
	encoding: "base64",
	solveEncoding: false
});

const pipeline = new PipeLiner(SQLiteInstance, crypt);
const db = new QuickDB({
    driver: pipeline,
});
db.init();


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
            const entry = EntryGenerator.generateEntry<string>(
                faker.datatype.string
            );
            await db.set(entry.id, entry.value);
            await db.delete(entry.id);
            const result = await db.get(entry.id);
            expect(result).toBeUndefined();
        });
    });

    describe("with initial data", () => {
        beforeEach(async () => {
            await db.set("test", "test");
            await db.set("object", { test: "test", other: "other" });
        });

        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should delete string", async () => {
            await db.delete("test");
            const result = await db.get("test");
            expect(result).toBeUndefined();
        });

        it("should delete object", async () => {
            await db.delete("object");
            const result = await db.get("object");
            expect(result).toBeUndefined();
        });

        it("should delete object property", async () => {
            await db.delete("object.test");
            const result = await db.get("object");
            expect(result).toEqual({ other: "other" });
        });
    });
});
