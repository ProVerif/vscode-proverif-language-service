# VSCode ProVerif Language Service

[![Available on the Visual Studio marketplace][vs-marketplace-shield]][vs-marketplace-link]
[![Available on the Open VSX marketplace][open-vsx-shield]][open-vsx-link]

[vs-marketplace-shield]: https://img.shields.io/visual-studio-marketplace/v/ProVerif.vscode-proverif?label=Visual%20Studio%20Marketplace
[vs-marketplace-link]: https://marketplace.visualstudio.com/items?itemName=ProVerif.vscode-proverif

[open-vsx-shield]: https://img.shields.io/open-vsx/v/ProVerif/vscode-proverif
[open-vsx-link]: https://open-vsx.org/extension/ProVerif/vscode-proverif

Visual Studio Code extension for ProVerif files (.pv, .pvl, .pcv). 

![Screenshot showing how the extension shows errors from ProVerif](./docs/sample.png)

Functionality:
- Adds syntax highlighting.
- Highlights the first syntax error ProVerif finds. For libraries, see below.
- Hover over an identifier to learn more about it.
- Press `CTRL` and click on an identifier to navigate to its definition or find all references of the definition.
- Press `F2` to rename an identifier.
- Press `CTRL`+`SHIFT`+`Space` to show signature help (automatically shown when typing `(`)
- Press `CTRL`+`SHIFT`+`B` to execute ProVerif over the currently opened file.
- Configure the proverif bin in the settings, else it is taken from the `$PATH`.

Settings:
- `Proverif Path`: Custom path to the proverif binary.
- `Parent Folder Discovery Limit`: Parent folders to read until discovery stops (e.g. to find references).

## Libraries (.pvl)

If your `.pv` or `.pvl` file depends on libraries, include a corresponding comment `(* -lib {library_path}.pvl *)`:

```proverif
(* -lib types.pvl *)

fun senc(bitstring, key): bitstring.
reduc forall m: bitstring, k: key; sdec(senc(m,k),k) = m.
```
