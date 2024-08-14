# Dekard

**Dekard is a simple file concatenation tool**. It allows you to process entire project directories, concatenating the contents of specified files into a single output file, with the ability to watch for changes and update the output automatically. Dekard is perfect for _compiling your project into context to provide for AI_.

## ✨Features

-   🔗Concatenate multiple files into a single output file
-   💬Add file path comments to the concatenated output
-   🔍Flexible file inclusion and exclusion with glob patterns
-   👀Watch mode for automatic updates on file changes
-   🖥️Easy to use CLI and programmatic API
-   🧠 Intelligent file ordering based on dependencies
-   🌐 Support for multiple languages (JavaScript, TypeScript, Python, Java)
-   🗣️ Verbose logging option for detailed output

## 🚀Installation

Install dekard globally:

```bash
npm install -g dekard
```

Or as a dependency in your project:

```bash
npm install dekard
```

## 🔧Usage

### Command Line Interface

1. Initialize a dekard configuration file in your project root:

```bash
dekard init
```

This will create a `dekard.json` file with default settings. 2. Run dekard

```bash
dekard
```

For verbose output:

```bash
dekard --verbose
```

_Or specify a custom config file_:

```bash
dekard path/to/custom-config.json
```

### Programmic Usage

```js
const { loadConfig, resolveConfig, processDirectory, watchDirectory } = require("dekard");

async function run() {
	const config = resolveConfig(await loadConfig("path/to/dekard.json"));

	if (config.watch) {
		watchDirectory(config);
	} else {
		await processDirectory(config);
	}
}

run().catch(console.error);
```

## ⚙️Configuration

The `dekard.json` file supports the following options:

-   `inputDir` (string): The root directory to process.
-   `outputFile` (string): The path to the output file.
-   `include` (string[]): Glob patterns for files to include.
-   `ignore` (string[]): Glob patterns for files to ignore.
-   `watch` (boolean): Whether to watch for file changes and update the output automatically.
-   `verbose` (boolean): Whether to output detailed logging information.

### Example Config `dekard.json`:

```json
{
	"inputDir": "./src",
	"outputFile": "./concatenated-output.txt",
	"include": ["**/*.ts", "**/*.tsx"],
	"ignore": ["**/*.test.ts", "node_modules/**"],
	"watch": false,
	"verbose": false
}
```

## 📝Example

Let's say you have the following directory structure:

```
src/
├── main.ts
├── utils.ts
└── test.ts
```

With the following content in each file:

`src/main.ts`:

```typescript
import { helper } from "./utils";
import { CONSTANT } from "./utils";

console.log(helper(CONSTANT));
```

`src/utils.ts`:

```typescript
export function helper(value: string): string {
	return `Helper: ${value}`;
}

export const CONSTANT = "Some constant value";
```

`src/test.ts`:

```typescript
import { helper } from "./utils";

describe("helper function", () => {
	it("should return correct string", () => {
		expect(helper("test")).toBe("Helper: test");
	});
});
```

Using the following `dekard.json`:

```json
{
	"inputDir": "./src",
	"outputFile": "./output.txt",
	"include": ["**/*.ts"],
	"ignore": ["**/*.test.ts"],
	"watch": false,
	"verbose": false
}
```

The resulting `output.txt` would look like this:

```
// File: src/utils.ts
export function helper(value: string): string {
  return `Helper: ${value}`;
}

export const CONSTANT = 'Some constant value';

// File: src/main.ts
import { helper } from './utils';
import { CONSTANT } from './utils';

console.log(helper(CONSTANT));
```

_You can just provide this file to any LLM and they will understand your project structure to work based off of it._

## 🧠 Intelligent File Ordering

Dekard now includes intelligent file ordering based on dependencies. This feature:

-   Analyzes imports and dependencies in your files
-   Orders files so that dependencies come before the files that use them
-   Supports JavaScript, TypeScript, Python, and Java
-   Falls back to original order if circular dependencies are detected

This ordering helps maintain a logical flow in the concatenated output, making it easier for humans or AI to understand the project structure and dependencies at a glance.

## 🤝Contributing

Contributions are welcome! Here are some ways you can contribute to this project:

1. Report bugs and issues
2. Suggest new features or enhancements
3. Submit pull requests to improve the codebase
4. Improve or add documentation

### Development Setup

1. Fork the repository
2. Clone your forked repository
3. Install dependencies with npm install
4. Make your changes
5. Run tests with npm test
6. Submit a pull request

Please ensure that your code adheres to the existing style and that all tests pass before submitting a pull request.

### Testing

To run the test suite, execute:

```bash
npm test
```

This will run all unit and integration tests for the project.

## 📄License

This project is licensed under the ISC License. See the LICENSE file for details.
