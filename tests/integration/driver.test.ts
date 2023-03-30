import { IDriver, JSONDriver, MemoryDriver, MongoDriver, MySQLDriver, PostgresDriver, SqliteDriver } from "../../src";
import { IRemoteDriver } from "../../src/interfaces/IRemoteDriver";
import * as dotenv from "dotenv";
import { resolve } from "path";
import fs from "fs";
dotenv.config({ path: resolve(process.cwd(), ".env.dev") });

if (!fs.existsSync("./integration-database")) {
    fs.mkdirSync("./integration-database");
}

const maxTime = 60; // seconds
const drivers = [
    new MySQLDriver({
        host: "127.0.0.1",
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        port: Number(process.env.MYSQL_PORT),
        database: process.env.MYSQL_DATABASE,
    }),
    new MongoDriver(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:${process.env.MONGO_PORT}/${process.env.MONGO_INITDB_DATABASE}?authSource=admin`),
    new PostgresDriver({
        host: "127.0.0.1",
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        port: Number(process.env.POSTGRES_PORT),
        database: process.env.POSTGRES_DB,
    }),
    new JSONDriver("./integration-database/test-driver.json"),
    new SqliteDriver("./integration-database/test-driver.sqlite"),
    new MemoryDriver(),
];

function isRemoteDriver(object: any): object is IRemoteDriver {
    return "connect" in object;
}

function sleep(time: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, time));
}

const driversWithNames = drivers.map((driver) => [driver.constructor.name, driver]) as [string, IDriver][];
describe("drivers integration tests", () => {
    afterAll(async () => {
        if (fs.existsSync("./integration-database")) {
            fs.rmdirSync("./integration-database", { recursive: true });
        }
    });

    describe("should connect to database", () => {
        test.each(driversWithNames)(
            'connects to database using %s',
            async (_, driver) => {
                const start = new Date().getTime();
                let now = new Date().getTime();
                let status = false;
                if (!isRemoteDriver(driver)) {
                    await (driver as IDriver).prepare(process.env.MYSQL_DATABASE!);
                    return true;
                }

                while (now - start < maxTime * 1000) {
                    try {
                        await driver.connect();
                        await driver.prepare(process.env.MYSQL_DATABASE!);
                        status = true;
                        break;
                    } catch (_) {
                        await sleep(1000);
                    }

                    now = new Date().getTime();
                }

                expect(status).toBe(true);
            }, 1000 * maxTime);
    });

    describe("integration tests", () => {
        afterEach(async () => {
            for (const driver of drivers) {
                await driver.deleteAllRows(process.env.MYSQL_DATABASE!);
            }
        });

        test.each(driversWithNames)(
            'should set and get data using %s',
            async (_, driver) => {
                const key = "foo";
                const value = "bar";
                await driver.setRowByKey(process.env.MYSQL_DATABASE!, key, value, false);
                let result = await driver.getRowByKey(process.env.MYSQL_DATABASE!, key);
                expect(result).toEqual([value, true]);

                result = await driver.getRowByKey(process.env.MYSQL_DATABASE!, "not-exists");
                expect(result).toEqual([null, false]);
            }
        );

        test.each(driversWithNames)(
            'should delete data using %s',
            async (_, driver) => {
                const key = "foobar";
                const value = "bar";
                await driver.setRowByKey(process.env.MYSQL_DATABASE!, key, value, false);
                let result = await driver.getRowByKey(process.env.MYSQL_DATABASE!, key);
                expect(result).toEqual([value, true]);

                await driver.deleteRowByKey(process.env.MYSQL_DATABASE!, key);
                result = await driver.getRowByKey(process.env.MYSQL_DATABASE!, key);
                expect(result).toEqual([null, false]);
            }
        );

        test.each(driversWithNames)(
            'should get all data using %s',
            async (_, driver) => {
                const key = "foobarbar";
                const value = "bar";
                await driver.setRowByKey(process.env.MYSQL_DATABASE!, key, value, false);
                const result = await driver.getAllRows(process.env.MYSQL_DATABASE!);
                expect(result.length).toBe(1);
                expect(result[0]).toEqual({ id: key, value });
            }
        );

        test.each(driversWithNames)(
            'should delete all data using %s',
            async (_, driver) => {
                await driver.deleteAllRows(process.env.MYSQL_DATABASE!);
                const result = await driver.getAllRows(process.env.MYSQL_DATABASE!);
                expect(result.length).toBe(0);
            }
        );
    });

    describe("should disconnect to database", () => {
        test.each(driversWithNames)(
            'connects to database using %s',
            async (_, driver) => {
                if (!isRemoteDriver(driver)) return true;

                return await driver.disconnect();
            }
        );
    });
});