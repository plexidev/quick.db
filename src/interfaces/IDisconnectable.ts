import { IDriver } from "./IDriver";

export interface IDisconnectable extends IDriver {
    disconnect(): Promise<unknown>;
}