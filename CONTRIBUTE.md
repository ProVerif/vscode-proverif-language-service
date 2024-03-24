# Contribute

Contributions welcome! Be aware of the automated tests (and keep them running).

Run & test locally:

- Run `npm install` in this folder. This installs all necessary npm modules in both the client and server folder.
- Open VS Code on this folder.
- Press Ctrl+Shift+B to start compiling the client and server in [watch mode](https://code.visualstudio.com/docs/editor/tasks#:~:text=The%20first%20entry%20executes,the%20HelloWorld.js%20file.).
- Switch to the Run and Debug View in the Sidebar (Ctrl+Shift+D).
- Select `Launch Client` from the drop-down (if it is not already).
- Press ▷ to run the launch config (F5).
- In the [Extension Development Host](https://code.visualstudio.com/api/get-started/your-first-extension#:~:text=Then%2C%20inside%20the%20editor%2C%20press%20F5.%20This%20will%20compile%20and%20run%20the%20extension%20in%20a%20new%20Extension%20Development%20Host%20window.) instance of VSCode, open a document with a ProVerif extension.
- Enter ProVerif code, and observe how syntax errors are highlighted.

## How it works: General architecture

The general architecture follows the [language server example](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide) published by Microsoft. There is a client that essentially only prepares the connection to the server. The server then contains all the (possibly expensive) actual logic.

In this project, the server caches aggressively to keep performance up. This leads to some associated complexity (e.g. invalidating the cache at appropriate points in time). The net tradeoff should however be positive. 

There are two testsuites; unit tests for the server and integration tests for the whole extension. The latter unfortunately seems not to work on the CI, hence has not been invested much. The server unit tests are however very useful to test how well the code navigation works, besides other things.

## How it works: Syntax errors

To report syntax errors, the language server simply invokes `proverif` over the currently edited file.
Syntax errors found by `proverif` are written to `stdout`, which this extension parses and processes appropriately.
For a `.pvl` file, the extension appends `process\n0` and parses it as a `.pv` file.

This has the advantage that the syntax errors are always correct and in sync with the actual proverif binary used by the user. As proverif is mostly a research tool, it is a use-case that different users run widely different proverif binaries.

This has however also the following limitations:
- Only the first syntax error is shown (as only the first is output by `proverif`).
- `proverif` is re-run on every keystroke with a timeout of 1s. This should suffice to find syntax errors, while preventing many proverif invocations hogging the CPU (as if no syntax error is found, `proverif` will start executing the proof).
- Some false errors are reported for `.pvl` files (e.g. an unused lemma). These errors are hidden if detected.

## How it works: Code navigation

The architecture is inspired by an article series by [tomassetti](https://tomassetti.me/go-to-definition-in-the-language-server-protocol/). 

The language server first lexes and parses the ProVerif code. Both the lexer as well as the parser are specified in Antl3r grammar, as this has good tool support to generate corresponding TypeScript code. The lexer is written by hand. The parser is transpiled from ProVerif's original `pitparser.mly` file using a python script called `pitparser-transpile-g4.py`.

Then, the language server builds up the symbol table. To do this, relevant grammar rules have to implemented manually. For most rules this should be done; some more obscure rules are however not implemented. As long as not all rules are implemented, navigation might fail or be wrong.

Lastly, the language server waits for the user to click on an identifier, and then picks the closest element in the symbol table. 

## How it works: Syntax highlighting

Syntax highlighting works primarily over the TextMate grammar in [./syntaxes/pv.tmLanguage.json](./syntaxes/pv.tmLanguage.json). As TextMate works quite differently to antlr, the rules are translated by hand. Details of the rules have been ommitted, to save on complexity. The primary task of the antlr grammar is to identify keywords, operators and types.

While the TextMate grammar is fast, it is unable to precisely color. For example, some expressions allow both variables and functions to be referenced, which cannot be easily expressed in the grammar. For this, the language server implements semantic tokens: It scans the whole file, and returns a list of tokens it recognises as functions, variables and parameters. VSCode then adjusts the colors appropriately.

## Publish

Process:
- Bump versions in the `package.json` (optionally in `server` and `client` too), and run `npm install`.
- Extend `CHANGELOG.md`.
- Run `vsce package` to generate the `.vsix`. 
- Commit and push to GitHub.
- Create a release on GitHub, using the `CHANGELOG.md` text and the generated `.vsix`.
- [automatic] CI publishes extension to https://marketplace.visualstudio.com/vscode and https://open-vsx.org/.

You can generate the authentication tokens needed for the release as described [here](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token) and [here](https://open-vsx.org/user-settings/tokens).

You can manage members of the ProVerif organization [here](https://marketplace.visualstudio.com/manage/publishers/proverif?noPrompt=true) and [here](https://open-vsx.org/user-settings/namespaces).

## Development path

To make the extension more powerful, following features should be considered:

Execute ProVerif:
- [x] Parse ProVerif output and show it to the user.
- [x] Add support for libraries (.pvl).
- [x] Add [custom task](https://code.visualstudio.com/api/extension-guides/task-provider) to automatically include libraries when invoking proverif.
- [x] Introduce proper caching / cache invalidation

Go to definition:
- [x] PoC of how to implement grammar
- [x] Implement grammar, symbol table, over libraries 
- [x] Add go to definition functionality; see https://tomassetti.me/integrating-code-completion-in-visual-studio-code/
- [x] Invalidate cache of consumers when library stored
- [x] Support additional ways of declaring variables (e.g. in REDUCTION lib)
- [ ] Properly implement macro resolution
- [ ] Improve performance by considering previous resolutions

Support writing ProVerif:
- [x] Configure language
- [x] Add syntax highlighting
- [x] Add semantic tokens (`connection.languages.semanticTokens`)
- [ ] Support syntactical autocomplete (`connection.onCompletion`)
- [ ] Support semantical autocomplete (see https://tomassetti.me/code-completion-with-antlr4-c3/#chapter12)

Refactorings:
- [ ] Introduce refactoring for free c: channel to replace with channel c
- [x] Introduce rename refactorings

Integrate Testing output:
- [ ] Integrate with [VSCode testing](https://code.visualstudio.com/api/extension-guides/testing) to show output of proverif nicely.
