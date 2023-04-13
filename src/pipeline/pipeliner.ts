import { IDriver } from "../interfaces/IDriver";
import { IPipeline } from "../interfaces/IPipeline";

export class PipeLiner<R> implements IDriver {
	public driver: IDriver;
	public pipeline: IPipeline<R, string>;

	constructor(driver: IDriver, pipeline: IPipeline<R, string>) {
		this.driver = driver;
		this.pipeline = pipeline
	}

	async prepare(table: string): Promise<void> {
		return await this.driver.prepare(table);
	}

	async getAllRows(table: string): Promise<{ id: string; value: any; }[]> {
		const rawData = await this.driver.getAllRows(table);

		const deserializedData = [];
		for (const entry of rawData) {
			const deserialized = await this.pipeline.deserialize(JSON.stringify(entry.value));
			deserializedData.push({ id: entry.id, value: deserialized });
		}

		return deserializedData;
	}
	
	async getRowByKey<T>(table: string, key: string): Promise<[T | null, boolean]> {
		const rawData = await this.driver.getRowByKey<T>(table, key);

		if (!rawData[0]) return rawData;

		const deserializedData = await this.pipeline.deserialize<T>(JSON.stringify(rawData[0]));
		return deserializedData ? [deserializedData, true] : [null, false];
	}
	
	async setRowByKey<T>(table: string, key: string, value: any, update: boolean): Promise<T> {
		const serializedData = await this.pipeline.serialize(value);

		const ret = await this.driver.setRowByKey<T>(table, key, serializedData, update);
		return ret;
	}
	
	async deleteAllRows(table: string): Promise<number> {
		return await this.driver.deleteAllRows(table);
	}
	
	async deleteRowByKey(table: string, key: string): Promise<number> {
		return await this.driver.deleteRowByKey(table, key);
	}
}