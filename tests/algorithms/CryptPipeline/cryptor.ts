import { ResolvedCryptOptions } from "../../../src/pipeline/crypto/crypt";

export async function encryptor(options: ResolvedCryptOptions, data: any): Promise<string> {
	return Buffer.from(JSON.stringify(data)).toString(options.encoding);
}

export async function decryptor(options: ResolvedCryptOptions, data: string): Promise<string> {
	return Buffer.from(data, options.encoding).toString("utf8");
}