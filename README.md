# Dekard

Dekard is a powerful file concatenation tool. It allows you to process entire project directories, concatenating the contents of specified files into a single output file, with the ability to watch for changes and update the output automatically. Dekard is perfect for compiling your project into context to provide to AI.

## Installation

Install dekard globally:

```bash
npm install -g dekard
```
Or as a dependency in your project:
```bash
npm install dekard
```
## Usage
### Command Line Interface

1. Create a dekard.json configuration file in your project root:
```json
{
  "inputDir": "./src",
  "outputFile": "./concatenated-output.txt",
  "include": ["**/*.ts", "**/*.js"],
  "ignore": ["**/*.test.ts", "**/*.spec.js", "node_modules/**"],
  "watch": false
}
```
2. Run dekard
```bash
dekard
```
Or specify a custom config file:
```bash
dekard path/to/custom-config.json
```
### Programmic Usage
```js
const { loadConfig, resolveConfig, processDirectory, watchDirectory } = require('dekard');

async function run() {
  const config = resolveConfig(await loadConfig('path/to/dekard.json'));
  
  if (config.watch) {
    watchDirectory(config);
  } else {
    await processDirectory(config);
  }
}

run().catch(console.error);
```
## Configuration

The `dekard.json` file supports the following options:

- `inputDir` (string): The root directory to process.
- `outputFile` (string): The path to the output file.
- `include` (string[]): Glob patterns for files to include.
- `ignore` (string[]): Glob patterns for files to ignore.
- `watch` (boolean): Whether to watch for file changes and update the output automatically.

Example `dekard.json`:

```json
{
  "inputDir": "./src",
  "outputFile": "./concatenated-output.txt",
  "include": ["**/*.ts", "**/*.js"],
  "ignore": ["**/*.test.ts", "**/*.spec.js", "node_modules/**"],
  "watch": false
}
```
## Features

- Concatenate multiple files into a single output file
- Add file path comments to the concatenated output
- Flexible file inclusion and exclusion with glob patterns
- Watch mode for automatic updates on file changes
- Easy to use CLI and programmatic API

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
## License
This project is licensed under the MIT License
