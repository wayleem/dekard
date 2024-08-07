import * as fs from "fs-extra";
import * as path from "path";
import * as chokidar from "chokidar";
import { glob } from "glob";
import { minimatch } from "minimatch";
import { Config } from "./config";

async function processFile(filePath: string, outputStream: fs.WriteStream): Promise<void> {
	const relativePath = path.relative(process.cwd(), filePath);
	const content = await fs.readFile(filePath, "utf-8");
	outputStream.write(`// File: ${relativePath}\n\n`);
	outputStream.write(content);
	outputStream.write("\n\n");
}

export async function processDirectory(config: Config): Promise<void> {
	const { inputDir, outputFile, include, ignore } = config;
	const outputStream = fs.createWriteStream(outputFile);

	const files = await glob(include, {
		cwd: inputDir,
		ignore,
		nodir: true,
		absolute: true,
	});

	for (const file of files) {
		await processFile(file, outputStream);
	}

	outputStream.end();
}

export function watchDirectory(config: Config): chokidar.FSWatcher {
	const { inputDir, include, ignore } = config;

	const watcher = chokidar.watch(include, {
		cwd: inputDir,
		ignored: ignore,
		persistent: true,
	});

	watcher.on("all", (event, path) => {
		console.log(`File ${path} has been ${event}`);
		processDirectory(config).catch(console.error);
	});

	console.log(`Watching directory: ${inputDir}`);
	return watcher;
}
