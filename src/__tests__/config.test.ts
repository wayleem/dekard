import { loadConfig, resolveConfig } from "../config";
import fs from "fs-extra";

jest.mock("fs-extra");

describe("Config", () => {
	const testConfigPath = "dekard.test.json";

	beforeEach(() => {
		jest.resetAllMocks();
	});

	afterEach(async () => {
		await fs.remove(testConfigPath);
	});

	test("loadConfig loads default config when file does not exist", async () => {
		const originalWarn = console.warn;
		console.warn = jest.fn();

		(fs.readFile as jest.MockedFunction<typeof fs.readFile>).mockRejectedValue(
			new Error("File not found") as never,
		);
		const config = await loadConfig(testConfigPath);
		expect(config).toEqual({
			inputDir: ".",
			outputFile: "dekard-output.txt",
			include: ["**/*"],
			ignore: ["node_modules/**", ".git/**"],
			watch: false,
			verbose: false,
		});

		console.warn = originalWarn;
	});

	test("resolveConfig resolves paths", () => {
		const config = resolveConfig({
			inputDir: "src",
			outputFile: "output.txt",
			include: ["**/*"],
			ignore: [],
			watch: false,
			verbose: false,
		});
		expect(config.inputDir).toContain("/src");
		expect(config.outputFile).toContain("/output.txt");
	});
});
