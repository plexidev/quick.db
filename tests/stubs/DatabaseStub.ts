import { Entry } from "../generators/EntryGenerator";

export class DatabaseStub {
    private static innerDb: { [key: string]: { [key: string]: any } } = {};

    public static insert(table: string, key: string, value: any) {
        this.innerDb[table][key] = value;
    }

    public static insertComplex(table: string, key: string, value: any) {
        const splitId = key.split(".");
        this.innerDb[table][splitId[0]] = {};
        let lastInsert = this.innerDb[table][splitId[0]];
        for (let i = 1; i < splitId.length; i++) {
            if (i != splitId.length - 1) {
                lastInsert[splitId[i]] = {};
                lastInsert = lastInsert[splitId[i]];
            } else {
                lastInsert[splitId[i]] = value;
            }
        }
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

    public static injectEntries(
        table: string,
        entries: Entry<any>[],
        complex = false
    ) {
        entries.forEach((entry) => {
            if (complex) {
                this.insertComplex(table, entry.id, entry.value);
            } else {
                this.insert(table, entry.id, entry.value);
            }
        });
    }
}
