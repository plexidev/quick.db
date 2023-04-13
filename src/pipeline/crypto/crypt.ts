/* eslint-disable no-console */
import crypto from "crypto";
import { IPipeline } from "../../interfaces/IPipeline";

/* CONSTANTS */
const cryptSymbol = "__SYM_QUICKDB_CRYPT__{%encoding%;%payload%}";
const cryptSymbolVars = ["encoding", "payload"] as const;

const Encoding = ["ucs2", "ucs-2", "base64", "base64url", "latin1", "hex"] as const;
const StringEncoding = ["ascii", "utf8", "utf-8", "utf16le", "ucs2", "ucs-2", "base64", "base64url", "latin1", "hex", "binary"] as const;

const algorithmByteSizes = {
	"custom": -1,
	"aes-128-cbc": 16, 
	"aes-192-cbc": 24, 
	"aes-256-cbc": 32
} as const;

/* INTERFACES AND TYPES */
type cryptSymbolVars = typeof cryptSymbolVars[number];

const CryptoAlgorithm = Object.keys(algorithmByteSizes);
type CryptoAlgorithm = keyof typeof algorithmByteSizes

type Encoding = typeof Encoding[number]
type StringEncoding = typeof StringEncoding[number]

export interface BuiltInCryptOptions {
	key: string | Buffer,
	algorithm?: CryptoAlgorithm,
	encoding?: Encoding,
	solveEncoding?: boolean
}
export interface CustomCryptOptions extends BuiltInCryptOptions {
	encryptor: Cryptor,
	decryptor: Cryptor
}

export type ResolvedCryptOptions = Required<BuiltInCryptOptions> & { byteSize: number }
export type CryptOptions = BuiltInCryptOptions | CustomCryptOptions
export type Cryptor = (options: ResolvedCryptOptions, data: string, encoding?: StringEncoding) => Promise<string>

type Payload<K extends string> = Record<K, string>;
type PayloadExtractor<K extends string> = ((str: string) => Payload<K> | undefined)

/**
 * Automatically extracts relevant data against a template from a string, if the string matches the template.
 *
 * @template K
 * @param {string} template
 * @return {*}  {PayloadExtractor<K>}
 */
function makePayloadExtractor<K extends string>(template: string): PayloadExtractor<K> {
	const varSymLength = 2;
	const varRegex = /%((?:[a-zA-Z_])+)%/gm;
	const indices: { index: number, length: number, name: K }[] = [];
	let result; 
	
	while ((result = varRegex.exec(template))) {
		indices.push({ index: result.index, length: result[1].length, name: result[1] as any });
	}

	const parts = [];
	let lastInd = 0;
	for (const part of indices) {
		parts.push(template.substring(lastInd, part.index));
		lastInd = part.index + part.length + varSymLength;
	}
	
	if (lastInd < template.length) parts.push(template.slice(lastInd, template.length));
	
	let payloadRegexStr = "^";
	for (let i = 0; i < parts.length - 1; i++) {
		payloadRegexStr += parts[i];
		payloadRegexStr += "(.*)";
	}
	
	payloadRegexStr += parts[parts.length - 1];
	payloadRegexStr += "$";
	
	const payloadRegex = new RegExp(payloadRegexStr);
	function payloadExtractor(str: string): Payload<K> | undefined {
		if (!payloadRegex.test(str)) return undefined;

		const matches = payloadRegex.exec(str) as RegExpExecArray;
		const ret: Payload<K> = {} as Payload<K>;

		for (let i = 0; i < indices.length; i++) {
			const variable = indices[i];
			const match = matches[i + 1];

			ret[variable.name] = match;
		}

		return ret;
	}

	return payloadExtractor;
}

/**
 * The Crypt pipeline adds cryptography to all data piped through to the database.
 * 
 * **WARNING:** Attempting to deserialize data which was serialized using a different algorithm / key ***will*** result in an error being thrown.
 * 
 * A custom encryption / decryption pair algorithm can be provided.
 * 
 * @example
 * const { PipeLiner, CryptoPipeline: { CryptPipeline }, QuickDB, SqliteDriver } = require("quick.db");
 * const SQLiteInstance = SqliteDriver.createSingleton("./crypt.sqlite");
 * const Crypt = new CryptPipeline({
 *   algorithm: "aes-128-cbc",
 *   key: "0000111122223333",
 *   encoding: "base64",
 *   solveEncoding: true
 * });
 * const pipeline = new PipeLiner(SQLiteInstance, Crypt);
 * 
 * const db = new QuickDB({ driver: pipeline });
 * await db.init();
 * 
 * // Database ready to be used.
 *
 * @export
 * @class CryptPipeline
 * @implements {IPipeline<string, string>}
 */
export class CryptPipeline implements IPipeline<string, string> {
	private options: ResolvedCryptOptions;
	// private pipelineOptions: PipelineOptions;
	private payloadExtractor: PayloadExtractor<cryptSymbolVars>;
	private encryptor: Cryptor;
	private decryptor: Cryptor;

	constructor(options: CryptOptions) {
		options.algorithm ??= "aes-128-cbc" as unknown as CryptoAlgorithm;
		options.encoding ??= "hex" as unknown as Encoding;
		options.solveEncoding ??= true;

		const byteSize = algorithmByteSizes[options.algorithm];

		// Runtime checks for pure JS users
		if (!options.key || options.key.length !== byteSize) throw new Error(`Encryption key must have ${byteSize} bytes`);
		if (!(CryptoAlgorithm as unknown as string[]).includes(options.algorithm)) throw new Error("Algorithm is not supported");
		if (!(Encoding as unknown as string[]).includes(options.encoding)) throw new Error("Encoding is not supported");
		options.solveEncoding = !!options.solveEncoding;

		this.options = {
			key: options.key,
			algorithm: options.algorithm,
			encoding: options.encoding,
			solveEncoding: options.solveEncoding,
			byteSize: 16
		}

		this.payloadExtractor = makePayloadExtractor<cryptSymbolVars>(cryptSymbol);

		// Check if custom encryption is being used, and ensure it is being correctly initialized
		if ( ("encryptor" in options && !("decryptor" in options)) || (!("encryptor" in options) && "decryptor" in options) )
			throw new Error("Both an encryptor and decryptor must be provided when using a custom algorithm.")
		else options.algorithm = "custom";

		if ("encryptor" in options) {
			if (typeof options.encryptor !== "function") throw new Error("Encriptor is not a function.");
			this.encryptor = options.encryptor;
		} else {
			this.encryptor ??= async function(options, data): Promise<string> {
				try {
					const iv = crypto.randomBytes(options.byteSize);
					const cipher = crypto.createCipheriv(options.algorithm, Buffer.from(options.key), iv);

					// Ensure data is a string
					const stringifiedData = (data as unknown) instanceof Object ? JSON.stringify(data) : data;

					return Buffer.concat([
						cipher.update(stringifiedData),
						cipher.final(), 
						iv
					]).toString(options.encoding);
				} catch (e: unknown) {
					const err = e instanceof Error ? e : new Error(`${e}`);

					throw new Error("Unknown error", { cause: err });
				}
			}
		}

		if ("decryptor" in options) {
			if (typeof options.decryptor !== "function") throw new Error("Decriptor is not a function.");
			this.decryptor = options.decryptor;
		} else {
			this.decryptor ??= async function(options, data, encoding): Promise<string> {
				try {
					encoding ??= "utf8";

					const binaryData = Buffer.from(data, options.encoding);
					const iv = binaryData.subarray(binaryData.length - options.byteSize, binaryData.length);
					const encryptedData = binaryData.subarray(0, binaryData.length - options.byteSize);

					const decipher = crypto.createDecipheriv(options.algorithm, Buffer.from(options.key), iv);
					const decrypted = Buffer.concat([
						decipher.update(encryptedData), 
						decipher.final()
					]);

					return decrypted.toString(encoding);
				} catch (e: unknown) {
					const err = e instanceof Error ? e : new Error(`${e}`);
					if (err.message.includes("error:1C800064:Provider routines::bad decrypt")) throw new Error("Bad decrypt");

					throw new Error("Unknown error", { cause: err });
				}
			}
		}
	}

	
	async serialize(value: string): Promise<string> {
		try {
			const encryptedData = await this.encryptor(this.options, value);
			return cryptSymbol.replace("%encoding%", this.options.encoding).replace("%payload%", encryptedData);
		} catch (e: unknown) {
			const err = e instanceof Error ? e : new Error(`${e}`);

			throw new Error("Unable to encrypt data", { cause: err });
		}
	}
	
	async deserialize<R>(data: string): Promise<R> {
		try {
			const nData = data.trim().replace(/^"/, "").replace(/"$/, "");
			const payload = this.payloadExtractor(nData);
			if (!payload) {
				return data as R;
			}

			const options = { ...this.options };
			if (payload.encoding !== "null") {
				if (!this.options.solveEncoding) throw new Error(`Invalid encoding. Expected '${this.options.encoding}', but got '${payload.encoding}'`)

				if (Encoding.includes(payload.encoding as Encoding)) options.encoding = payload.encoding as Encoding;
			}

			const decryptedData = await this.decryptor(options, payload.payload, "utf8");

			try {
				return JSON.parse(decryptedData) as R;
			} catch (_) {
				return decryptedData as R;
			}
		} catch (e: unknown) {
			const err = e instanceof Error ? e : new Error(`${e}`);

			throw new Error("Unable to decrypt data", { cause: err });
		}
	}
}