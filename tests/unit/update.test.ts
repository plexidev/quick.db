import { QuickDB } from '../../src';
import { ErrorKind } from '../../src/error';
import { EntryGenerator } from '../generators/EntryGenerator';
import { SqliteDriverMock } from '../mocks/SqliteDriver';

const db = new QuickDB({
    driver: new SqliteDriverMock("test.sqlite"),
});
db.init();

describe("update", () => {
    afterEach(async () => {
        SqliteDriverMock.mockClear();
        await db.deleteAll();
    });

    describe("no initial data", () => {
        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should update entry", async () => {
            const entry = EntryGenerator.generateEntry<object>(() => ({
                new: 1,
            }));

            const returned = await db.update(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual(entry.value);
            expect(returned).toEqual(entry.value);
        });

        it("should update from object property", async () => {
            const entry = EntryGenerator.generateComplexEntry<object>(() => ({
                new: 1,
            }));

            const returned = await db.update(entry.id, entry.value);
            const result = await db.get(entry.id);
            expect(result).toEqual(entry.value);

            const obj = {} as any;
            obj[entry.id.split(".")[1]] = entry.value;
            expect(returned).toEqual(obj);
        });
    });

    describe("with initial data", () => {
        beforeEach(async () => {
            await db.set("object", { test: 10, toChange: 5 });
            await db.set("wrong", [2]);
        });

        afterEach(async () => {
            SqliteDriverMock.mockClear();
            await db.deleteAll();
        });

        it("should error when object current value is not object", async () => {
            await expect(async () =>
                db.update("wrong", { something: "nice" })
            ).rejects.toThrow(
                expect.objectContaining({ kind: ErrorKind.InvalidType })
            );
        });

        it("should update the current object", async () => {
            const entry = EntryGenerator.generateEntry<object>(() => ({
                new: 1,
                toChange: 100,
            }));

            const returned = await db.update("object", entry.value);
            const result = await db.get("object");
            expect(result).toEqual({ test: 10, toChange: 100, new: 1 });
            expect(result).toEqual(returned);
        });
    });
});
