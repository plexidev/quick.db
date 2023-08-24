import { QuickDB } from '../../src';
import { ErrorKind } from '../../src/error';
import { SqliteDriverMock } from '../mocks/SqliteDriver';

const db = new QuickDB({
    driver: new SqliteDriverMock("test.sqlite"),
});
db.init();

describe("singleton", () => {
    it("should register singleton and retrive singleton", () => {
        QuickDB.registerSingleton("test", {
            driver: new SqliteDriverMock("nice.sqlite"),
        });

        const result = QuickDB.getSingletion("test");
        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(QuickDB);
    });

    it("should error when registering singleton without name", () => {
        expect(QuickDB.registerSingleton).toThrow(
            expect.objectContaining({ kind: ErrorKind.InvalidType })
        );
    });

    it("should error when getting singleton without name", () => {
        expect(QuickDB.getSingletion).toThrow(
            expect.objectContaining({ kind: ErrorKind.InvalidType })
        );
    });
});
