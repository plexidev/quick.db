import { IDisconnectable } from "./IDisconnectable";

export interface IRemoteDriver extends IDisconnectable {
    connect(): Promise<unknown>;
}