#!/usr/bin/env node

import { processDirectory, watchDirectory, loadConfig, resolveConfig } from "./index";

async function main() {
	const configPath = process.argv[2] || "dekard.json";
	const config = resolveConfig(await loadConfig(configPath));

	if (config.watch) {
		watchDirectory(config);
	} else {
		await processDirectory(config);
		console.log(`Processed directory: ${config.inputDir}`);
		console.log(`Output file: ${config.outputFile}`);
	}
}

main().catch(console.error);
