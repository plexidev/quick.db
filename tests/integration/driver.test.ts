import { MySQLDriver } from "../../src";
import * as dotenv from 'dotenv'
dotenv.config();

const drivers = [
    new MySQLDriver({
        host: "127.0.0.1",
        user: "root",
        password: process.env.MYSQL_ROOT_PASSWORD,
        port: Number(process.env.MYSQL_PORT),
        database: process.env.MYSQL_DATABASE,
    })
];

const maxTime = 60; // seconds

async function tryConnectAndPrepare(driver: any, fn: any): Promise<boolean> {
    if (fn in driver) {
        await driver[fn]();
        await driver.prepare(process.env.MYSQL_DATABASE);
        return true;
    }

    return true;
}

describe("drivers integration tests", () => {
    describe("should connect to database", () => {
        test.each(drivers.map(driver => [driver.constructor.name, driver]))("connects to database using %p", async (_, driver) => {
            const start = new Date().getTime();
            let now = new Date().getTime();
            let status = false;
            while (now - start < maxTime * 1000) {
                const connected = await tryConnectAndPrepare(driver, "connect").catch(() => false);
                if (connected) {
                    status = true;
                    break;
                }

                now = new Date().getTime();
            }

            return expect(status).toBe(true);
        }, 1000 * maxTime);

    });
});