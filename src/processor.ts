import * as fs from "fs-extra";
import * as path from "path";
import * as chokidar from "chokidar";
import { glob } from "glob";
import { Config } from "./config";
import { errorLog, verboseLog } from "./logger";

interface LanguageAnalyzer {
	analyzeImports(content: string): string[];
}

const analyzers: Record<string, LanguageAnalyzer> = {
	".js": {
		analyzeImports: (content: string) => {
			const importRegex = /(?:import|require)\s*\(?['"](.+?)['"]\)?/g;
			return Array.from(content.matchAll(importRegex), (m) => m[1]);
		},
	},
	".ts": {
		analyzeImports: (content: string) => {
			const importRegex = /(?:import|from)\s+['"](.+?)['"]/g;
			return Array.from(content.matchAll(importRegex), (m) => m[1]);
		},
	},
	".py": {
		analyzeImports: (content: string) => {
			const importRegex = /(?:import|from)\s+(\S+)/g;
			return Array.from(content.matchAll(importRegex), (m) => m[1]);
		},
	},
	".java": {
		analyzeImports: (content: string) => {
			const importRegex = /import\s+(.+?);/g;
			return Array.from(content.matchAll(importRegex), (m) => m[1]);
		},
	},
};

async function analyzeDependencies(files: string[], config: Config): Promise<Map<string, Set<string>>> {
	const dependencies = new Map<string, Set<string>>();

	for (const file of files) {
		try {
			const content = await fs.readFile(file, "utf-8");
			const ext = path.extname(file);
			const analyzer = analyzers[ext];

			if (!analyzer) {
				verboseLog(config, `No analyzer found for file type: ${ext}. Skipping dependency analysis for ${file}`);
				continue;
			}

			const imports = analyzer.analyzeImports(content);
			const deps = new Set<string>();

			for (const importPath of imports) {
				try {
					const resolvedPath = path.resolve(path.dirname(file), importPath);
					if (await fs.pathExists(resolvedPath)) {
						deps.add(resolvedPath);
					} else {
						verboseLog(config, `Warning: Import not found: ${resolvedPath}`);
					}
				} catch (error) {
					verboseLog(config, `Error resolving import ${importPath} in ${file}: ${error}`);
				}
			}

			dependencies.set(file, deps);
			verboseLog(config, `Dependencies for ${file}:`, Array.from(deps));
		} catch (error) {
			errorLog(config, `Error processing file ${file}: ${error}`);
		}
	}

	return dependencies;
}

function topologicalSort(graph: Map<string, Set<string>>): string[] {
	const result: string[] = [];
	const visited = new Set<string>();
	const temp = new Set<string>();

	function visit(node: string) {
		if (temp.has(node)) {
			throw new Error("Circular dependency detected");
		}
		if (!visited.has(node)) {
			temp.add(node);
			const neighbors = graph.get(node) || new Set();
			for (const neighbor of neighbors) {
				visit(neighbor);
			}
			temp.delete(node);
			visited.add(node);
			result.unshift(node);
		}
	}

	for (const node of graph.keys()) {
		if (!visited.has(node)) {
			visit(node);
		}
	}

	return result;
}

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

	verboseLog(config, "Files found:", files);

	let sortedFiles: string[];
	try {
		const dependencies = await analyzeDependencies(files, config);
		sortedFiles = topologicalSort(dependencies);
		verboseLog(config, "Sorted files:", sortedFiles);
	} catch (error: unknown) {
		errorLog(config, "Error during dependency analysis:", error instanceof Error ? error.message : String(error));
		errorLog(config, "Falling back to unsorted file processing");
		sortedFiles = files;
	}

	for (const file of sortedFiles) {
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
		verboseLog(config, `File ${path} has been ${event}`);
		processDirectory(config).catch(console.error);
	});

	verboseLog(config, `Watching directory: ${inputDir}`);
	return watcher;
}
