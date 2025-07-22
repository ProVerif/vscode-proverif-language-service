# Changelog

## v1.8.12

Update dependencies.  


## v1.8.11

Update dependencies.  


## v1.8.10

Support more permissible grammar around dots and semicolons.  


## v1.8.9

Fix crash in `*.pvl` files with incomplete destructors.  


## v1.8.8

Introduce `.test.pv` files with syntax coloring (experimental, subject to radical changes or removal).  
In `.pv.log` files, improve syntax coloring of lemmas, axioms and restrictions.  
In `.pv.log` files, improve syntax coloring of counters.  


## v1.8.7

In `.pv.log` files, improve syntax coloring of equalities.  
In `.pv.log` files, improve detection of error results.


## v1.8.6

In `.pv.log`, fix navigation to attack trace step.


## v1.8.5

Improve variable scoping, notably of lemma parameters.


## v1.8.4

Add equations declared with `reduc` to symbol table to allow navigation and renames.  
Hide options from rendered function declaration if empty (e.g. on hover).  
In `.pv.log` files, improve navigation to attack trace step.


## v1.8.3

In `.pv.log` files, add navigation to attack trace step.  
In `.pv.log` files, improve syntax highlighting.


## v1.8.2

Add custom grammar scope for `data converters` and `type converters` to improve syntax highlighting.  
Fix highlighting bugs for `[precise]` and `else if`.  
Add `proveLemmaOnly` to completion.


## v1.8.1

Improve navigation and doccomment detection.  
In `.pv.log` files, highlight lemmas that cannot be proven or are false.


## v1.8.0

Add doccomments: Add `(** documentation with two stars **)` before entities so the documentation is shown on how. Supports `fun`, `let`, `letfun`, `predicate`, `event`, `table` and `define`.  
Navigate in `.pv.log` files to the definition of process references (e.g. `{21}`).  


## v1.7.1

Use `-parse-only` if available to improve performance.  
Send notification to user if proverif bin is not found.


## v1.7.0

Add autocomplete for set statements.  
Add new `pv.log` language, which colors ProVerif output.


## v1.6.5

Update dependencies.


## v1.6.4

Rework symbol table for more accurate definitions.


## v1.6.3

Fix crashes when file has grammar errors.


## v1.6.2

Add `in` to `pterm` in TextMate grammar and improve word detection.


## v1.6.1

Improvements to TextMate grammar and semantic tokens.


## v1.6.0

Add language configuration, TextMate grammar and semantic tokens.


## v1.5.0

Add hover.


## v1.4.0

Add signature help.


## v1.3.1

Restrict reference discovery to ProVerif files.


## v1.3.0

Introduce find all references and rename.


## v1.2.4

Maintenance release.


## v1.2.3

Improve build processes and greatly reduce extension size (-80%).


## v1.2.2

Some administrative changes:
- Move to the ProVerif organisation
- Update logo

Small feature:
- Support macro navigation


## v1.2.1

Fix small issues:
- Hide error in .pvl files which is likely a false positive
- Fix context in library grammar nodes to improve go to definition functionality
- Add table arguments to symbol table to improve go to definition functionality


## v1.2.0

Improve caching and introduce go to definition functionality.


## v1.1.0

Fix small bugs, and introduce proper caching.


## v1.0.4

Add a ProVerif task provider, and improve library support (detect duplicate libraries, attribute library errors).


## v1.0.3

Add support for libraries (.pvl).


## v1.0.2

Properly document functionality & publicly release extension.


## v1.0.1

Fix bug with long proofs.


## v1.0.0

Initial release.