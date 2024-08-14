#!/usr/bin/env node
import { processDirectory, watchDirectory, loadConfig, resolveConfig } from "./index";
import fs from "fs-extra";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { DEFAULT_CONFIG } from "./config";

async function createConfigFile() {
	const configPath = path.resolve(process.cwd(), "dekard.json");
	if (await fs.pathExists(configPath)) {
		console.log(`Config file already exists at ${configPath}`);
		return;
	}
	await fs.writeJson(configPath, DEFAULT_CONFIG, { spaces: 2 });
	console.log(`Config file created at ${configPath}`);
}

async function main() {
	const argv = await yargs(hideBin(process.argv))
		.option("verbose", {
			alias: "v",
			type: "boolean",
			description: "Run with verbose logging",
		})
		.parse();

	const command = argv._[0];
	if (command === "init") {
		await createConfigFile();
		return;
	}

	const config = resolveConfig(await loadConfig());
	config.verbose = argv.verbose || false;
	if (config.watch) {
		watchDirectory(config);
	} else {
		await processDirectory(config);
		console.log(`Processed directory: ${config.inputDir}`);
		console.log(`Output file: ${config.outputFile}`);
	}
}

main().catch(console.error);
