# Contribute

Contributions welcome! Be aware of the automated tests (and keep them running).

Heavily inspired by the [language server example](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide) published by Microsoft. 

Run & test locally:

- Run `npm install` in this folder. This installs all necessary npm modules in both the client and server folder.
- Open VS Code on this folder.
- Press Ctrl+Shift+B to start compiling the client and server in [watch mode](https://code.visualstudio.com/docs/editor/tasks#:~:text=The%20first%20entry%20executes,the%20HelloWorld.js%20file.).
- Switch to the Run and Debug View in the Sidebar (Ctrl+Shift+D).
- Select `Launch Client` from the drop down (if it is not already).
- Press ▷ to run the launch config (F5).
- In the [Extension Development Host](https://code.visualstudio.com/api/get-started/your-first-extension#:~:text=Then%2C%20inside%20the%20editor%2C%20press%20F5.%20This%20will%20compile%20and%20run%20the%20extension%20in%20a%20new%20Extension%20Development%20Host%20window.) instance of VSCode, open a document with a ProVerif extension.
- Enter ProVerif code, and observe how syntax errors are highlighted.

## How it works

Under the hood, this language server simply invokes `proverif` over the currently edited file.
Syntax errors found by `proverif` are written to `stdout`, which this extension parses and sends to VSCode.
For a `.pvl` file, the extension appends `process\n0` and parses it as a `.pv` file.

This has the following limitations:
- Only the first syntax error is shown (as only the first is output by `proverif`).
- `proverif` is re-run on every keystroke with a timeout of 1s. This should suffice to find syntax errors, while preventing many proverif invocations hogging the CPU (as if no syntax error is found, `proverif` will start executing the proof).

## Publish

Make sure you have https://github.com/microsoft/vscode-vsce installed.

Checklist:
- Bump versions in affected `package.json` (including `server` and `client`).
- Commit and tag.
- `vsce package` to create the `.vsix` 
- `vsce publish` to publish the new version to the marketplace
- Upload the extension to GitHub
- Upload the extension to https://open-vsx.org/

If you are doing this for the first time on your machine, you need to login with `vsce login florianalexandermoser` with an authentication token from [here](https://famoser.visualstudio.com/_usersSettings/tokens). 

## Development path

To make the extension more powerful, following features should be considered:

Execute ProVerif:
- [x] Parse ProVerif output and show it to the user.
- [x] Add support for libraries (.pvl).
- [x] Add [custom task](https://code.visualstudio.com/api/extension-guides/task-provider) to automatically include libraries when invoking proverif.
- [x] Introduce proper caching / cache invalidation

Go to definition:
- [x] PoC of how to implement grammar
- [ ] Fully implement grammar, symbol table, over libraries 
- [ ] Add go to definition functionality; see https://tomassetti.me/integrating-code-completion-in-visual-studio-code/
- [ ] Invalidate cache of consumers when library stored

Refactorings:
- [ ] Introduce refactoring for free c: channel to replace with channel c
- [ ] Introduce rename refactorings

Code completion:
- [ ] Override connection.onCompletion to return keywords, variables, ...; see https://tomassetti.me/code-completion-with-antlr4-c3/#chapter12

Integrate Testing output:
- [ ] Integrate with [VSCode testing](https://code.visualstudio.com/api/extension-guides/testing) to show output of proverif nicely.
