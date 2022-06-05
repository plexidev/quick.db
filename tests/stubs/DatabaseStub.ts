import { Entry } from "../generators/EntryGenerator";

export class DatabaseStub {
    private static innerDb: any = { json: {} };

    public static insert(table: string, key: string, value: any) {
        this.innerDb[table][key] = value;
    }

    public static insertTable(table: string) {
        this.innerDb[table] = {};
    }

    public static extract(table: string, key: string) {
        this.innerDb[table][key];
    }

    public static extractTable(table: string) {
        return this.innerDb[table];
    }

    public static delete(table: string, key: string) {
        delete this.innerDb[table][key];
    }
}
