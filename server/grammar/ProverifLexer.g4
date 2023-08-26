// considered lexer.mll and pitparser.mly in proverif/src

lexer grammar ProverifLexer;

DelimitedComment
    : '(*' ( DelimitedComment | . )*? '*)'
      -> channel(HIDDEN)
    ;

WS
    : [\u0020\u0009\u000C\u000D\u000A] // match SP (space), HT (tab), FF (page reak), CR (carriage return), LF (line feed)
      -> channel(HIDDEN)
    ;

//SEPARATORS & OPERATIONS

DOT: '.' ;
COLON: ':' ;
SEMICOLON: ';' ;

COMMA: ',' ;
LPAREN: '(';
RPAREN: ')' ;
LSQUARE: '[';
RSQUARE: ']' ;

ADD: '+' ;
SUB: '-' ;

STAR: '*' ;
HASH: '#' ;
AT: '@' ;

ARROW: '==>' ;
CONJUNCTION: '&&' ;
DISJUNCTION: '||' ;

LESS: '<' ;
GREATER: '>' ;
LESS_EQUAL: '<=' ;
GREATER_EQUAL: '>=' ;
NOT_EQ: '<>' ;
EQ: '=' ;

//KEYWORDS
/*
among, axiom, channel, choice, clauses, const, def, diff, do, elimtrue, else, equation, equivalence,
event, expand, fail, for, forall, foreach, free, fun, get, if, implementation, in, inj-event,
insert, lemma, let, letfun, letproba, new, noninterf, noselect, not, nounif, or, otherwise, out,
param, phase, pred, proba, process, proof, public_vars, putbegin, query, reduc, restriction,
secret, select, set, suchthat, sync, table, then, type, weaksecret, yield
*/

FREE: 'free' ;
CHANNEL: 'channel' ;
PROCESS: 'process' ;
OUT: 'out' ;
IN: 'in' ;

Number
    : Digit+
    ;

BooleanLiteral
    : 'true'
    | 'false'
    ;

Identifier
    : Letter (Letter | Digit | SpecialCharacter | Latin1AdditionalLetters)*
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

fragment Latin1AdditionalLetters
    : '\u00C0'..'\u00D6'
    | '\u00D8'..'\u00F6'
    | '\u00F8'..'\u00FF'
    ;

