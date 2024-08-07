import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";

describe("CLI", () => {
	const testConfigPath = path.resolve(process.cwd(), "dekard.test.json");
	const testOutputFile = path.resolve(process.cwd(), "dekard-output.txt");
	const cliPath = path.join(__dirname, "../../dist/cli.js");

	beforeEach(async () => {
		await fs.writeJson(testConfigPath, {
			inputDir: ".",
			outputFile: "dekard-output.txt",
			include: ["**/*.ts"],
			ignore: [],
			watch: false,
		});
	});

	afterEach(async () => {
		await fs.remove(testConfigPath);
		await fs.remove(testOutputFile);
	});

	test("CLI runs without errors", () => {
		expect(() => {
			const output = execSync(`node ${cliPath} ${testConfigPath}`, { stdio: "pipe" }).toString();
			console.log("CLI output:", output);
		}).not.toThrow();
	});

	test("CLI creates output file", async () => {
		const output = execSync(`node ${cliPath} ${testConfigPath}`, { stdio: "pipe" }).toString();
		console.log("CLI output:", output);

		const outputExists = await fs.pathExists(testOutputFile);
		console.log("Output file exists:", outputExists);

		if (!outputExists) {
			const currentDir = process.cwd();
			const files = await fs.readdir(currentDir);
			console.log("Current directory:", currentDir);
			console.log("Files in current directory:", files);
		}

		expect(outputExists).toBe(true);
	});
});
