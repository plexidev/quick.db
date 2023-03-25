import type mongoose from "mongoose";
import { IDriver } from "./IDriver";

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
export class MongoDriver implements IDriver {
    public connection: mongoose.Connection | undefined;
    public mongoose: typeof mongoose;
    private models = new Map<string, ReturnType<typeof this.modelSchema>>();
    // eslint-disable-next-line @typescript-eslint/ban-types
    docSchema: mongoose.Schema<CollectionInterface<unknown>, mongoose.Model<CollectionInterface<unknown>, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, CollectionInterface<unknown>>;

    public constructor(public url: string, public options: mongoose.ConnectOptions = {}) {
        this.mongoose = require("mongoose");
        this.docSchema = new this.mongoose.Schema<CollectionInterface>(
            {
                ID: {
                    type: this.mongoose.SchemaTypes.String,
                    required: true,
                    unique: true
                },
                data: {
                    type: this.mongoose.SchemaTypes.Mixed,
                    required: false
                },
                expireAt: {
                    type: this.mongoose.SchemaTypes.Date,
                    required: false,
                    default: null
                }
            },
            {
                timestamps: true
            }
        );
    }

    public connect(): Promise<MongoDriver> {
        // eslint-disable-next-line
        return new Promise(async (resolve, reject) => {
            this.mongoose.createConnection(this.url, this.options, (err: any, connection: any) => {
                if (err) return reject(err);
                this.connection = connection;
                resolve(this);
            });
        });
    }

    public close(force?: boolean) {
        return this.connection?.close(force);
    }

    private checkConnection() {
        if (this.connection == null) throw new Error(`MongoDriver is not connected to the database`);
    }

    public async prepare(table: string) {
        this.checkConnection();
        if (!this.models.has(table)) this.models.set(table, this.modelSchema(table));
    }

    private async getModel(name: string) {
        await this.prepare(name);
        return this.models.get(name);
    }

    async getAllRows(table: string): Promise<{ id: string; value: any }[]> {
        this.checkConnection();
        const model = await this.getModel(table);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return (await model!.find()).map((row: any) => ({
            id: row.ID,
            value: row.data
        }));
    }

    async getRowByKey<T>(table: string, key: string): Promise<[T | null, boolean]> {
        this.checkConnection();
        const model: any = await this.getModel(table);
        // wtf quickdb?
        const res = await model.find({ ID: key });
        return res.map((m: any) => m.data);
    }

    async setRowByKey<T>(table: string, key: string, value: any, update: boolean): Promise<T> {
        this.checkConnection();
        const model = await this.getModel(table);
        void update;
        await model?.findOneAndUpdate(
            {
                ID: key
            },
            {
                $set: { data: value }
            },
            { upsert: true }
        );

        return value;
    }

    async deleteAllRows(table: string): Promise<number> {
        this.checkConnection();
        const model = await this.getModel(table);
        const res = await model?.deleteMany();
        
       
        return res!.deletedCount!;  // eslint-disable-line @typescript-eslint/no-non-null-assertion
    }

    async deleteRowByKey(table: string, key: string): Promise<number> {
        this.checkConnection();
        const model = await this.getModel(table);

        const res = await model?.deleteMany({
            ID: key
        });

        
        return res!.deletedCount!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    }

    modelSchema<T = unknown>(modelName = "JSON") {
        this.checkConnection();
        // @ts-expect-error docSchema
        const model = this.connection!.model<CollectionInterface<T>>(modelName, this.docSchema); // eslint-disable-line @typescript-eslint/no-non-null-assertion
        model.collection.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 }).catch(() => {
            /* void */
        });
        return model;
    }
}