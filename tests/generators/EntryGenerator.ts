import { faker } from "@faker-js/faker";
export class EntryGenerator {
    public static generateEntries<T>(
        genNumber = 10,
        fakerF: () => unknown = faker.datatype.string
    ): Entry<T>[] {
        const genereted = [];
        for (let i = 0; i < genNumber; i++) {
            genereted.push(
                new Entry<T>(faker.datatype.uuid(), fakerF() as unknown as T)
            );
        }

        return genereted;
    }

    public static generateComplexEntry<T>(
        genNumber = 10,
        fakerF: () => unknown = faker.datatype.string
    ): Entry<T>[] {
        const generated = this.generateEntries<T>(genNumber, fakerF);
        return generated.map((entry) => {
            entry.id += "." + faker.datatype.uuid();
            return entry;
        });
    }
}

export class Entry<T> {
    public id: string;
    public value: T;

    constructor(id: string, value: T) {
        this.id = id;
        this.value = value;
    }
}
