# VSCode ProVerif Language Service

[![Available on the Visual Studio marketplace][vs-marketplace-shield]][vs-marketplace-link]
[![Available on the Open VSX marketplace][open-vsx-shield]][open-vsx-link]

[vs-marketplace-shield]: https://img.shields.io/visual-studio-marketplace/v/FlorianAlexanderMoser.vscode-proverif-language-service?label=Visual%20Studio%20Marketplace
[vs-marketplace-link]: https://marketplace.visualstudio.com/items?itemName=FlorianAlexanderMoser.vscode-proverif-language-service

[open-vsx-shield]: https://img.shields.io/open-vsx/v/FlorianAlexanderMoser/vscode-proverif-language-service
[open-vsx-link]: https://open-vsx.org/extension/FlorianAlexanderMoser/vscode-proverif-language-service

Visual Studio Code extension for ProVerif files (.pv, .pvl, .pcv). 
It shows you the first syntax error ProVerif finds:

![Screenshot showing how the extension shows errors from ProVerif](./docs/sample.png)

Ensure you have ProVerif installed, and it is in your `$PATH` (i.e. when entering `proverif` in your console, the tool executes).

Use in combination with https://github.com/georgio/proverif-vscode to get syntax highlighting.

## Functionality

Under the hood, this language server simply invokes `proverif` over the currently edited file.
Syntax errors found by `proverif` are written to `stdout`, which this extension parses and sends to VSCode.

This has the following limitations:
- Only the first syntax error is shown (as only the first is output by `proverif`).
- `proverif` is re-run on every keystroke with a timeout of 1s. This should suffice to find syntax errors, while preventing many proverif invocations hogging the CPU (as if no syntax error is found, `proverif` will start executing the proof).

