# VSCode ProVerif Language Service

A very simple (stupid) ProVerif language service. It will show you syntax errors in VSCode:

![Screenshot showing how the extension shows errors from ProVerif](./docs/sample.png)

Ensure you have `ProVerif` installed, and it is in your `$PATH` (i.e. when entering `proverif` in your console, the tool executes).

Use in combination with https://github.com/georgio/proverif-vscode to get syntax highlighting.

## Functionality

Under the hood, this language server simply invokes `proverif` over the currently edited file. 

This has the following limitations:
- Only the first syntax error is shown (as only the first is output by `proverif`).
- `proverif` is re-run on every keystroke.
- `proverif` will attempt to proof the lemmas if no syntax error is found. The extension attempts to prevent high CPU usage by terminating `proverif` execution after one second (as then likely no syntax error exists; and the extension cannot process proof output anyways).

