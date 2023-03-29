import { IDriver, JSONDriver, MongoDriver, MySQLDriver, PostgresDriver, SqliteDriver } from "../../src";
import { IRemoteDriver } from "../../src/interfaces/IRemoteDriver";
import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env.dev") });
import fs from "fs";

// check if folder integration-database exists
// if not create it
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
];

function isRemoteDriver(object: any): object is IRemoteDriver {
    return "connect" in object;
}

function sleep(time: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, time));
}

describe("drivers integration tests", () => {
    describe("should connect to database", () => {
        test.each(drivers.map(driver => [driver.constructor.name, driver]))("connects to database using %p", async (_, driver) => {
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
            return await driver.disconnect();
        }, 1000 * maxTime);

    });
});