export interface IDriver {
    getAllRows(): Promise<{ id: string; value: any }[]>;
    getRowByKey<T>(key: string): Promise<T | null>;
    setRowByKey<T>(key: string, value: any, update: boolean): Promise<T>;
    deleteAllRows(): Promise<number>;
    deleteRowByKey(key: string): Promise<number>;
}
