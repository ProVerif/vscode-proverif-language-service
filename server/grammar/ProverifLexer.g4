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
    : [\u0020\u0009\u000C\u000D\u000A] // match SP (space), HT (tab), FF (page reak), CR (carriage return), LF (line feed)
      -> channel(HIDDEN)
    ;

/**
seperators and operators
*/
DOT: '.' ;
COLON: ':' ;
SEMI: ';' ;

UNDERSCORE: '_';
COMMA: ',' ;
LPAREN: '(';
RPAREN: ')' ;
LBRACE: '{';
RBRACE: '}' ;
LBRACKET: '[';
RBRACKET: ']' ;

REPL: '!' ;
BAR: '|';

SLASH: '/';
POWER: '^';
PLUS: '+' ;
MINUS: '-' ;

STAR: '*' ;
COUNT: '#' ;
AT: '@' ;

LEFTARROW: '<-' ;
RANDOM: '<-R' ;

WEDGE: '&&' ;
OR: '||' ;
BEFORE: '==>' ;

LESS: '<' ;
GREATER: '>' ;
LEQ: '<=' ;
GEQ: '>=' ;
DIFF: '<>' ;
EQUAL: '=' ;

RED: '->';
EQUIV: '<->';
EQUIVEQ: '<=>';

//KEYWORDS
/*
among, axiom, channel, choice, clauses, const, def, diff, do, elimtrue, else, equation, equivalence,
event, expand, fail, for, forall, foreach, free, fun, get, if, implementation, in, inj-event,
insert, lemma, let, letfun, letproba, new, noninterf, noselect, not, nounif, or, otherwise, out,
param, phase, pred, proba, process, proof, public_vars, putbegin, query, reduc, restriction,
secret, select, set, suchthat, sync, table, then, type, weaksecret, yield
*/

/**
term: state
*/
NEW: 'new';
CHOICE: 'choice' | 'diff';
LET: 'let';
INSERT: 'insert';
EVENT: 'event';

/**
term: control structures
*/
GET: 'get';
IF: 'if';
THEN: 'then';
ELSE: 'else';
SUCHTHAT: 'suchthat';
IN: 'in';
NOT: 'not';
ORTEXT: 'or';
FAIL: 'fail';

/**
declaration: definitions
*/
TYPE: 'type';
CHANNEL: 'channel' ;
FREE: 'free' ;
CONST: 'const';
TABLE: 'table';
// LET: 'let'; duplicate
SET: 'set';

/**
declaration: equations
*/
FUN: 'fun';
LETFUN: 'letfun';
REDUCTION: 'reduc';
EQUATION: 'equation';
PREDICATE: 'pred';
ELIMTRUE: 'elimtrue';
CLAUSES: 'clauses';

/**
declaration: proofs
*/
QUERY: 'query';
AXIOM: 'axiom';
RESTRICTION: 'restriction';
LEMMA: 'lemma';
NONINTERF: 'noninterf';
AMONG: 'among';
WEAKSECRET: 'weaksecret';
// NOT: 'not'; duplicate

/**
declaration: tune resolution strategy
*/
SELECT: 'select';
NOUNIF: 'nounif' | 'noselect';

/**
declaration: cryptoverif compatability
*/
PARAM: 'param'; // ignored by ProVerif
PROBA: 'proba'; // ignored by ProVerif
LETPROBA: 'letproba'; // ignored by ProVerif
PROOF: 'proof'; // ignored by ProVerif
IMPLEMENTATION: 'implementation'; // ignored by proverif
DEFINE: 'def';
EXPAND: 'expand';

/**
destructors
*/
// LET: 'let'; duplicate
// IN: 'in'; duplicate
FOR: 'for';
DO: 'do';
FORALL: 'forall';
OTHERWISE: 'otherwise';

/**
query
*/
PUBLICVARS: 'public vars';
SECRET: 'secret';
PUTBEGIN: 'putbegin';

/**
queries
*/
// EVENT: 'event'; duplicate
INJEVENT: 'inj-event';
// ATTACKER: 'attacker'; not treated as its own taken, rather as IDENT
// MESS: 'mess'; not treated as its own taken, rather as IDENT
PHASE: 'phase';
// CHOICE: 'choice'; duplicate
// NEW: 'new'; duplicate
// LET: 'let'; duplicate

/**
noinfoptions
*/
HZPOTHESIS: 'hypothesis';
CONCLUSION: 'conclusion';
IGNORE_A_FEW_TIMES: 'ignoreAFewTimes';
INDUCTION_ON: 'inductionOn';

/**
equivalence
*/
EQUIVALENCE: 'equivqlence';

/**
process
*/
PROCESS: 'process' ;
YIELD: 'yield';
FOREACH: 'foreach';
// IN: 'in'; duplicate
OUT: 'out' ;
BARRIER: 'sync';
OPTIMIF: 'optim-if';
ISCST: 'is-cst';

INT
    : Digit+
    ;

PROJECTION
    : Digit+ '-proj-' IDENT+
    ;

FLOAT
    : Digit+ '.' Digit*
    | Digit+ ('.' Digit*)? ('e'|'E') ('+'|'-')? Digit*
    ;

IDENT
    : Letter (Letter | Digit | SpecialCharacter | Latin1AdditionalLetter)*
    ;

TAG
    : (AT | Letter) (AT | Letter | Digit | SpecialCharacter | Latin1AdditionalLetter)*
    ;

STRING
    : '"' .*? '"'
    ;


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

