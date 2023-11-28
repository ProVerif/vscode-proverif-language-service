// considered lexer.mll and pitparser.mly in proverif/src

lexer grammar ProverifLexer;

/**
whitespace & comments
*/
DelimitedComment
    : '(*' ( DelimitedComment | . )*? '*)'
      -> channel(HIDDEN)
    ;

WS
    : [\u0020\u0009\u000C\u000D\u000A] // match SP (space), HT (tab), FF (page break), CR (carriage return), LF (line feed)
      -> channel(HIDDEN)
    ;

/* keyword table */
TYPE: 'type'; // scope storage.type.impl
SET: 'set'; // scope storage.type.impl
FORALL: 'forall'; // scope keyword.operator
FAIL: 'fail'; // scope constant.language
ORTEXT: 'or'; // scope keyword.control
CONST: 'const'; // scope storage.type.impl
LETFUN: 'letfun'; // scope storage.type.impl
CHANNEL: 'channel'; // scope storage.type.impl
DEFINE: 'def'; // scope storage.type.cryptoverif
EXPAND: 'expand';  // scope storage.type.impl
YIELD: 'yield'; // scope keyword.control
PROBA: 'proba'; // scope keyword.cryptoverif
LETPROBA: 'letproba'; // scope keyword.cryptoverif
PROOF: 'proof'; // scope keyword.cryptoverif
IMPLEMENTATION: 'implementation'; // scope keyword.cryptoverif
FOREACH: 'foreach'; // scope keyword.control
DO: 'do'; // scope keyword.control
SECRET: 'secret'; // scope storage.modifier
PUBLICVARS: 'public_vars'; // scope storage.modifier
TABLE: 'table'; // scope storage.type.impl
INSERT: 'insert'; // scope keyword.other.state
GET: 'get'; // scope keyword.control
PARAM: 'param'; // scope storage.type.impl
NEW: 'new'; // scope keyword.other.state
OUT: 'out'; // scope keyword.other.state
IN: 'in'; // scope keyword.other.state
IF: 'if'; // scope keyword.control
THEN: 'then'; // scope keyword.control
ELSE: 'else'; // scope keyword.control
FUN: 'fun'; // scope storage.type.impl
EQUATION: 'equation'; // scope storage.type.theory
REDUCTION: 'reduc'; // scope storage.type.theory
PREDICATE: 'pred'; // scope keyword.other
PROCESS: 'process'; // scope keyword.control
LET: 'let'; // scope keyword.control
QUERY: 'query'; // scope storage.type.query
PUTBEGIN: 'putbegin'; // scope storage.modifier
NONINTERF: 'noninterf'; // scope storage.type.query
EVENT: 'event'; // scope storage.type.impl
NOT: 'not'; // scope keyword.operator.logical
ELIMTRUE: 'elimtrue'; // scope keyword.other
FREE: 'free';  // scope storage.type.impl
CLAUSES: 'clauses'; // scope keyword.other
SUCHTHAT: 'suchthat'; // scope keyword.control
NOUNIF: 'nounif' | 'noselect'; // scope storage.type.query
SELECT: 'select'; // scope storage.type.query
PHASE: 'phase'; // scope keyword.control
BARRIER: 'sync'; // scope keyword.control
AMONG: 'among';  // scope storage.modifier
WEAKSECRET: 'weaksecret'; // scope storage.type.query
EQUIVALENCE: 'equivalence'; // scope keyword.control
OTHERWISE: 'otherwise'; // scope storage.type.theory
CHOICE: 'choice' | 'diff'; // scope keyword.other.state
LEMMA: 'lemma'; // scope storage.type.query
AXIOM: 'axiom'; // scope storage.type.query
RESTRICTION: 'restriction'; // scope storage.type.query
FOR: 'for'; // scope keyword.control

INT
    : Digit+
    ;

PROJECTION
    : Digit+ '-proj-' IDENT+
    ;

FLOAT
    : Digit+ '.' Digit+
    | Digit+ ('.' Digit*)? ('e'|'E') ('+'|'-')? Digit+
    ;

IDENT
    : Letter (Letter | Digit | SpecialCharacter | Latin1AdditionalLetter)*
    ;

STRING
    : '"' .*? '"'
    ;

AT: '@'; // scope punctuation.accessor

OPTIMIF: 'optim-if'; // scope keyword.other
ISCST: 'is-cst'; // scope keyword.other

COUNT: '#'; // scope punctuation.accessor
COMMA: ','; // scope punctuation.separator
LPAREN: '('; // scope punctuation.section.brackets.begin
RPAREN: ')'; // scope punctuation.section.brackets.end
LBRACKET: '['; // scope punctuation.section.brackets.begin
RBRACKET: ']'; // scope punctuation.section.brackets.end
LBRACE: '{'; // scope punctuation.section.brackets.begin
RBRACE: '}'; // scope punctuation.section.brackets.end
BAR: '|'; // scope keyword.control
OR: '||'; // scope keyword.operator.logical
WEDGE: '&&'; // scope keyword.operator.logical
SEMI: ';'; // scope punctuation.terminator
REPL: '!'; // scope keyword.control
EQUAL: '='; // scope keyword.operator.assigment
SLASH: '/'; // scope keyword.operator.arithmetic
DOT: '.'; // scope punctuation.terminator
STAR: '*'; // scope variable.other
COLON: ':'; // scope punctuation.separator
PLUS: '+'; // scope keyword.operator.arithmetic
MINUS: '-'; // scope keyword.operator.arithmetic
POWER: '^'; // scope keyword.operator.arithmetic
RED: '->'; // scope keyword.operator.assigment
LEQ: '<='; // scope keyword.operator.comparison
EQUIV: '<->'; // scope keyword.operator.comparison
EQUIVEQ: '<=>'; // scope keyword.operator.comparison
DIFF: '<>'; // scope keyword.operator.comparison
BEFORE: '==>'; // scope keyword.operator.implication
LESS: '<'; // scope keyword.operator.comparison
GEQ: '>='; // scope keyword.operator.comparison
GREATER: '>'; // scope keyword.operator.comparison
LEFTARROW: '<-'; // scope keyword.operator.assignment
RANDOM: '<-R'; // scope keyword.operator.assignment
UNDERSCORE: '_'; // scope variable.other
INJEVENT: 'inj-event'; // scope storage.modifier

fragment Digit
    : [0-9]
    ;

fragment Letter
    : [a-zA-Z]
    ;

fragment SpecialCharacter
    : '\''
    | '_'
    ;

fragment Latin1AdditionalLetter
    : '\u00C0'..'\u00D6'
    | '\u00D8'..'\u00F6'
    | '\u00F8'..'\u00FF'
    ;

