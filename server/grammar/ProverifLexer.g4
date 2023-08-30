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
SEMICOLON: ';' ;

COMMA: ',' ;
LPAREN: '(';
RPAREN: ')' ;
LSQUARE: '[';
RSQUARE: ']' ;

BANG: '!' ;

ADD: '+' ;
SUB: '-' ;

STAR: '*' ;
HASH: '#' ;
AT: '@' ;

ASSIGNMENT: '<-' ;
ASSIGNMENT_RANDOM: '<-R' ;

CONJUNCTION: '&&' ;
DISJUNCTION: '||' ;
CORRESPONDENCE: '==>' ;

LESS: '<' ;
GREATER: '>' ;
LESS_EQUAL: '<=' ;
GREATER_EQUAL: '>=' ;
NOT_EQUAL: '<>' ;
EQUAL: '=' ;

IMPLICATION: '->';
EQUIVALENCE: '<->';
EQUIVALENCE_VARIANT: '<=>';

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
CHOICE: 'choice';
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
OR_FAIL: 'or fail';
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
REDUC: 'reduc';
EQUATION: 'equation';
PRED: 'pred';
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
NO_SELECT: 'noselect';
NO_UNIF: 'nounif';

/**
declaration: cryptoverif compatability
*/
PARAM: 'param'; // ignored by ProVerif
PROBA: 'proba'; // ignored by ProVerif
LETPROBA: 'letproba'; // ignored by ProVerif
PROOF: 'proof'; // ignored by ProVerif
DEF: 'def';
EXPAND: 'expand';

/**
destructors
*/
// LET: 'let'; duplicate
// IN: 'in'; duplicate
FORALL: 'forall';
OTHERWISE: 'otherwise';

/**
query
*/
PUBLIC_VARS: 'public vars';
SECRET: 'secret';
PUTBEGIN_EVENT: 'putbegin event';
PUTBEGIN_INJ_EVENT: 'putbegin inj-event';
REAL_OR_RANDOM: 'real_or_random';

/**
queries
*/
// EVENT: 'event'; duplicate
INJ_EVENT: 'inj-event';
ATTACKER: 'attacker';
MESS: 'mess';
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
process
*/
PROCESS: 'process' ;
YIELD: 'yield';
FOREACH: 'foreach';
// IN: 'in'; duplicate
OUT: 'out' ;
SYNC: 'sync';

Number
    : Digit+
    ;

BooleanLiteral
    : 'true'
    | 'false'
    ;

Identifier
    : Letter (Letter | Digit | SpecialCharacter | Latin1AdditionalLetter)*
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

