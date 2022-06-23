import { faker } from "@faker-js/faker";

export class Entry<T> {
    public id: string;
    public value: T;

    constructor(id: string, value: T) {
        this.id = id;
        this.value = value;
    }
}

export class EntryGenerator {
    public static generateEntries<T>(
        fakerF: () => unknown = faker.datatype.string,
        genNumber = 10
    ): Entry<T>[] {
        const genereted: Entry<T>[] = [];
        for (let i = 0; i < genNumber; i++) {
            genereted.push(
                new Entry<T>(faker.datatype.uuid(), fakerF() as unknown as T)
            );
        }

        return genereted;
    }

    public static generateComplexEntries<T>(
        fakerF: () => unknown = faker.datatype.string,
        genNumber = 10
    ): Entry<T>[] {
        const generated = this.generateEntries<T>(fakerF, genNumber);
        return generated.map((entry) => {
            entry.id += "." + faker.datatype.uuid();
            return entry;
        });
    }

    public static generateDeepComplexEntries<T>(
        fakerF: () => unknown = faker.datatype.string,
        genNumber = 10,
        pass = 2
    ): Entry<T>[] {
        const generated = this.generateEntries<T>(fakerF, genNumber);
        return generated.map((entry) => {
            for (let i = 0; i < pass; i++) {
                entry.id += "." + faker.datatype.uuid();
            }
            return entry;
        });
    }
}
