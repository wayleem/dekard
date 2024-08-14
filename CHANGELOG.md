# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] - YYYY-MM-DD

### Added

-   Support for analyzing .tsx and .jsx files
-   Improved TypeScript import resolution, handling cases where file extensions are omitted in import statements

### Changed

-   Updated dependency analysis to use a more robust import resolution strategy

### Fixed

-   Resolved issue where .tsx and .jsx files were being skipped during analysis

## [1.2.0] - 2024-08-14

### Added

-   Intelligent file ordering based on dependencies
-   Support for multiple languages (JavaScript, TypeScript, Python, Java)
-   Verbose logging option with `--verbose` or `-v` flag
-   Improved error handling for dependency analysis

### Changed

-   Updated default configuration to include common file types for supported languages
-   Refactored internal structure for better maintainability

## [1.1.1] - 2024-08-06

### Added

-   Init command to create a default configuration file
-   Add jest tests for developers

## [1.0.0] - 2024-08-06

### Added

-   Initial release of Dekard
-   File concatenation functionality
-   Watch mode for automatic updates
-   Configuration file support
