import { IRemoteDriver } from "./interfaces/IRemoteDriver";
import { IDisconnectable } from "./interfaces/IDisconnectable";

export function isConnectable(object: any): object is IRemoteDriver {
    return "connect" in object;
}

export function isDisconnectable(object: any): object is IDisconnectable {
    return "disconnect" in object;
}
