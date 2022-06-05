import { faker } from "@faker-js/faker";
export class EntryGenerator {
    public static generateEntry<T>(
        genNumber = 10,
        fakerF = faker.datatype.string
    ): Entry<T>[] {
        const genereted = [];
        for (let i = 0; i < genNumber; i++) {
            genereted.push(
                new Entry<T>(faker.datatype.uuid(), fakerF() as unknown as T)
            );
        }

        return genereted;
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
