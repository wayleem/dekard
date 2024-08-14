import { processDirectory } from "../processor";
import fs from "fs-extra";
import * as glob from "glob";

jest.mock("fs-extra");
jest.mock("glob");

describe("Processor", () => {
	const testOutputFile = "test-output.txt";

	beforeEach(() => {
		jest.resetAllMocks();
	});

	afterEach(async () => {
		await fs.remove(testOutputFile);
	});

	test("processDirectory processes files correctly", async () => {
		(glob.glob as jest.MockedFunction<typeof glob.glob>).mockResolvedValue(["file1.ts", "file2.ts"]);
		(fs.readFile as jest.MockedFunction<typeof fs.readFile>).mockResolvedValue("file content" as never);
		const mockWriteStream = {
			write: jest.fn(),
			end: jest.fn(),
		};
		(fs.createWriteStream as jest.MockedFunction<typeof fs.createWriteStream>).mockReturnValue(
			mockWriteStream as any,
		);

		await processDirectory({
			inputDir: "src",
			outputFile: testOutputFile,
			include: ["**/*.ts"],
			ignore: [],
			watch: false,
			verbose: false,
		});

		expect(mockWriteStream.write).toHaveBeenCalledTimes(6);
		expect(mockWriteStream.end).toHaveBeenCalled();

		const writeCallArgs = mockWriteStream.write.mock.calls.map((call) => call[0]);
		expect(writeCallArgs).toContain("// File: file1.ts\n\n");
		expect(writeCallArgs).toContain("file content");
		expect(writeCallArgs).toContain("// File: file2.ts\n\n");
		expect(writeCallArgs).toContain("file content");
	});
});
