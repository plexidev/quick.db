import { Entry } from "../generators/EntryGenerator";

export class DatabaseStub {
    private static innerDb: { [key: string]: { [key: string]: any } } = {};

    public static insert(table: string, key: string, value: any) {
        this.innerDb[table][key] = value;
    }

    public static insertTable(table: string) {
        this.innerDb[table] = {};
    }

    public static extract(table: string, key: string) {
        return this.innerDb[table][key];
    }

    public static extractTable(table: string) {
        return this.innerDb[table];
    }

    public static delete(table: string, key: string) {
        delete this.innerDb[table][key];
    }

    public static injectEntries(table: string, entries: Entry<any>[]) {
        entries.forEach((entry) => {
            this.insert(table, entry.id, entry.value);
        });
    }
}
