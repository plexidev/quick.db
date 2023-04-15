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
	encoding: "base64url",
	solveEncoding: false
});

const pipeline = new PipeLiner(SQLiteInstance, crypt);
const db = new QuickDB({
    driver: pipeline,
});
db.init();

describe("startsWith", () => {
    afterEach(async () => {
        SqliteDriverMock.mockClear();
        await db.deleteAll();
    });

    describe("no initial data", () => {
        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should return empty array", async () => {
            const entry = EntryGenerator.generateEntry<number>(
                faker.datatype.number
            );
            const returned = await db.startsWith(entry.id);
            expect(returned).toEqual([]);
        });
    });

    describe("with initial data", () => {
        beforeEach(async () => {
            await db.set("test_1", true);
            await db.set("test_2", true);
            await db.set("test_3", true);
            await db.set("nope_1", true);
        });

        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should returnall tests", async () => {
            const returned = await db.startsWith("test");
            expect(returned.length).toEqual(3);
            for (let i = 0; i < returned.length; i++) {
                const el = returned[i];
                expect(el.id).toEqual(`test_${i + 1}`);
                expect(el.value).toEqual(true);
            }
        });
    });
});
