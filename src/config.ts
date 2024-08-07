import * as fs from "fs-extra";
import * as path from "path";

export interface Config {
	inputDir: string;
	outputFile: string;
	include: string[];
	ignore: string[];
	watch: boolean;
}

const DEFAULT_CONFIG: Config = {
	inputDir: ".",
	outputFile: "dekard-output.txt",
	include: ["**/*"],
	ignore: ["node_modules/**", ".git/**"],
	watch: false,
};

export async function loadConfig(configPath: string = "dekard.json"): Promise<Config> {
	try {
		const configFile = await fs.readFile(configPath, "utf-8");
		const userConfig = JSON.parse(configFile);
		return { ...DEFAULT_CONFIG, ...userConfig };
	} catch (error) {
		console.warn(`Warning: Could not read config file: ${configPath}. Using default configuration.`);
		return DEFAULT_CONFIG;
	}
}

export function resolveConfig(config: Config): Config {
	return {
		...config,
		inputDir: path.resolve(config.inputDir),
		outputFile: path.resolve(config.outputFile),
	};
}
