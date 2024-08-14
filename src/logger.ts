import { Config } from "./config";

export function verboseLog(config: Config, ...args: any[]) {
	if (config.verbose) {
		console.log(...args);
	}
}

export function errorLog(config: Config, ...args: any[]) {
	if (config.verbose) {
		console.warn("[VERBOSE]", ...args);
	}
}
