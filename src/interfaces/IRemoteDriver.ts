import { IDriver } from "./IDriver";

export interface IRemoteDriver extends IDriver {
    connect(): Promise<unknown>;
    disconnect(): Promise<unknown>;
}