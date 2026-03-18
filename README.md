# Inline Calculator for VS Code

A lightweight, powerful inline calculator extension for Visual Studio Code. It allows you to quickly evaluate mathematical expressions directly within your editor using commands or a dedicated sidebar, without needing to switch to an external calculator app.

## Features

- **Quick Calculation via Command Palette:** Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows) and type `Inline Calculator: Calculate Expression`, or simply use the shortcut `Alt+C` (`Option+C` on Mac) to bring up an input box.
- **Dedicated Sidebar View:** A handy sidebar view that provides a persistent input box for your calculations.
- **Calculation History:** The sidebar automatically saves your calculation history. You can click on any history item to instantly copy the result to your clipboard.
- **Advanced Mathematical Functions:** Powered by `mathjs`, this extension supports complex mathematical operations and custom LaTeX-style functions:
  - Basic arithmetic: `+`, `-`, `*`, `/`
  - Power: `^` (e.g., `2^3`)
  - Natural logarithm: `\ln(x)`
  - Logarithm with custom base: `\log_{base}(x)` (e.g., `\log_{2}(8)`)
  - Trigonometric functions: `\sin(x)`, `\cos(x)`
  - Rounding: `\floor(x)`, `\ceil(x)`

## Usage

1. **Using Shortcut:** Press `Alt+C` (`Option+C` on Mac), enter your expression (e.g., `\log_{2}(8) + 2^3`), and hit Enter. The result will be displayed in an information message and added to your history.
2. **Using Sidebar:** Click the Calculator icon in the Activity Bar on the left. Type your expression in the input box at the top and press Enter.

## Extension Settings

Currently, this extension works out of the box with zero configuration required.

## Release Notes

### 0.0.1
- Initial release of Inline Calculator.
- Added support for custom mathematical symbols (`\ln`, `\log_{}`, `\sin`, `\cos`, `\floor`, `\ceil`).
- Added sidebar history view with embedded input box.
- Registered global shortcut `Alt+C`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
