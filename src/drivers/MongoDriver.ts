import {
    ConnectOptions,
    Connection,
    Model,
    Schema,
    SchemaTypes,
    createConnection,
    pluralize,
} from "mongoose";
import { IRemoteDriver } from "../interfaces/IRemoteDriver";

export interface CollectionInterface<T = unknown> {
    ID: string;
    data: T;
    createdAt: Date;
    updatedAt: Date;
    expireAt?: Date;
}

/**
 * Quick.db compatible mongo driver
 * @example // require quickdb
 * const { QuickDB } = require("quick.db");
 * // require mongo driver from quickmongo
 * const { MongoDriver } = require("quickmongo");
 * // create mongo driver
 * const driver = new MongoDriver("mongodb://localhost/quickdb");
 *
 * // connect to mongodb
 * await driver.connect();
 *
 * // create quickdb instance with mongo driver
 * const db = new QuickDB({ driver });
 *
 * // set something
 * await db.set("foo", "bar");
 *
 * // get something
 * console.log(await db.get("foo")); // -> foo
 */
export class MongoDriver implements IRemoteDriver {
    public conn?: Connection;
    private models = new Map<string, ReturnType<typeof this.modelSchema>>();
    docSchema: Schema<CollectionInterface<unknown>>;

    public constructor(
        public url: string,
        public options: ConnectOptions = {},
        pluralizeP = false
    ) {
        if (!pluralizeP) pluralize(null);

        this.docSchema = new Schema<CollectionInterface>(
            {
                ID: {
                    type: SchemaTypes.String,
                    required: true,
                    unique: true,
                },
                data: {
                    type: SchemaTypes.Mixed,
                    required: false,
                },
                expireAt: {
                    type: SchemaTypes.Date,
                    required: false,
                    default: null,
                },
            },
            {
                timestamps: true,
            }
        );
    }

    public async connect(): Promise<MongoDriver> {
        const connection = await createConnection(
            this.url,
            this.options
        ).asPromise();
        this.conn = connection;
        return this;
    }

    public async disconnect(): Promise<void> {
        return await this.conn?.close();
    }

    private checkConnection(): void {
        if (this.conn == null)
            throw new Error(`MongoDriver is not connected to the database`);
    }

    public async prepare(table: string): Promise<void> {
        this.checkConnection();
        if (!this.models.has(table))
            this.models.set(table, this.modelSchema(table));
    }

    private async getModel<T = unknown>(
        name: string
    ): Promise<Model<CollectionInterface<T>> | undefined> {
        await this.prepare(name);
        return this.models.get(name) as
            | Model<CollectionInterface<T>>
            | undefined;
    }

    async getAllRows(table: string): Promise<{ id: string; value: any }[]> {
        this.checkConnection();
        const model = await this.getModel(table);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return (await model!.find()).map((row: any) => ({
            id: row.ID,
            value: row.data,
        }));
    }

    async getRowByKey<T>(
        table: string,
        key: string
    ): Promise<[T | null, boolean]> {
        this.checkConnection();
        const model = await this.getModel(table);
        const res = await model!.findOne({ ID: key });
        if (!res) return [null, false];
        return [res.data as T | null, true];
    }

    async setRowByKey<T>(
        table: string,
        key: string,
        value: any,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _update: boolean
    ): Promise<T> {
        this.checkConnection();
        const model = await this.getModel(table);
        await model?.findOneAndUpdate(
            {
                ID: key,
            },
            {
                $set: { data: value },
            },
            { upsert: true }
        );

        return value;
    }

    async deleteAllRows(table: string): Promise<number> {
        this.checkConnection();
        const model = await this.getModel(table);
        const res = await model?.deleteMany();

        return res!.deletedCount!;
    }

    async deleteRowByKey(table: string, key: string): Promise<number> {
        this.checkConnection();
        const model = await this.getModel(table);

        const res = await model?.deleteMany({
            ID: key,
        });

        return res!.deletedCount!;
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    modelSchema<T = unknown>(
        modelName = "JSON"
    ): Model<CollectionInterface<T>> {
        this.checkConnection();
        const model = this.conn!.model(modelName, this.docSchema);
        model.collection
            .createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 })
            .catch(() => {
                /* void */
            });
        return model as Model<CollectionInterface<T>>;
    }
}
