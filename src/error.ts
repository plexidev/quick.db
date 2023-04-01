export enum ErrorKind {
    MissingKey = "MISSING_KEY",
    MissingValue = "MISSING_VALUE",
    MissingDriver = "MISSING_DRIVER",
    ParseException = "PARSE_EXCEPTION",
    InvalidType = "INVALID_TYPE",
}

export class CustomError extends Error {
    public message: string;
    public kind: ErrorKind;

    public constructor(message: string, kind: ErrorKind) {
        super();
        Error.captureStackTrace(this, this.constructor);

        this.message = message;
        this.kind = kind;
        this.name = kind;
    }
}
