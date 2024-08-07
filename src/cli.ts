#!/usr/bin/env node

import { processDirectory, watchDirectory, loadConfig, resolveConfig } from "./index";
import fs from "fs-extra";
import path from "path";

const defaultConfig = {
	inputDir: "./src",
	outputFile: "./dekard-output.txt",
	include: ["**/*.ts", "**/*.js"],
	ignore: ["**/*.test.ts", "**/*.test.js", "**/node_modules/**"],
	watch: false,
};

async function createConfigFile() {
	const configPath = path.resolve(process.cwd(), "dekard.json");

	if (await fs.pathExists(configPath)) {
		console.log(`Config file already exists at ${configPath}`);
		return;
	}

	await fs.writeJson(configPath, defaultConfig, { spaces: 2 });
	console.log(`Config file created at ${configPath}`);
}

async function main() {
	const command = process.argv[2];

	if (command === "init") {
		await createConfigFile();
		return;
	}

	const config = resolveConfig(await loadConfig());

	if (config.watch) {
		watchDirectory(config);
	} else {
		await processDirectory(config);
		console.log(`Processed directory: ${config.inputDir}`);
		console.log(`Output file: ${config.outputFile}`);
	}
}

main().catch(console.error);
