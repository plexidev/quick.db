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
    public static generateEntry<T>(fakerF: () => unknown): Entry<T> {
        return new Entry<T>(faker.string.uuid(), fakerF() as unknown as T);
    }

    public static generateEntries<T>(
        fakerF: () => unknown,
        genNumber = 10
    ): Entry<T>[] {
        const genereted: Entry<T>[] = [];
        for (let i = 0; i < genNumber; i++) {
            genereted.push(this.generateEntry<T>(fakerF));
        }

        return genereted;
    }

    public static generateComplexEntry<T>(fakerF: () => unknown): Entry<T> {
        const generated = this.generateEntry<T>(fakerF);
        generated.id += "." + faker.string.uuid();
        return generated;
    }

    public static generateComplexEntries<T>(
        fakerF: () => unknown,
        genNumber = 10
    ): Entry<T>[] {
        const genereted: Entry<T>[] = [];
        for (let i = 0; i < genNumber; i++) {
            genereted.push(this.generateComplexEntry<T>(fakerF));
        }

        return genereted;
    }

    public static generateDeepComplexEntries<T>(
        fakerF: () => unknown,
        genNumber = 10,
        pass = 2
    ): Entry<T>[] {
        const generated = this.generateEntries<T>(fakerF, genNumber);
        return generated.map((entry) => {
            for (let i = 0; i < pass; i++) {
                entry.id += "." + faker.string.uuid();
            }
            return entry;
        });
    }
}
