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
TYPE: 'type';
SET: 'set';
FORALL: 'forall';
FAIL: 'fail'; 
ORTEXT: 'or'; 
CONST: 'const'; 
LETFUN: 'letfun'; 
CHANNEL: 'channel'; 
DEFINE: 'def'; 
EXPAND: 'expand'; 
YIELD: 'yield'; 
PROBA: 'proba'; 
LETPROBA: 'letproba'; 
PROOF: 'proof'; 
IMPLEMENTATION: 'implementation'; 
FOREACH: 'foreach'; 
DO: 'do'; 
SECRET: 'secret'; 
PUBLICVARS: 'public_vars'; 
TABLE: 'table'; 
INSERT: 'insert'; 
GET: 'get'; 
PARAM: 'param'; 
NEW: 'new'; 
OUT: 'out'; 
IN: 'in'; 
IF: 'if'; 
THEN: 'then'; 
ELSE: 'else'; 
FUN: 'fun'; 
EQUATION: 'equation'; 
REDUCTION: 'reduc'; 
PREDICATE: 'pred'; 
PROCESS: 'process'; 
LET: 'let'; 
QUERY: 'query'; 
PUTBEGIN: 'putbegin'; 
NONINTERF: 'noninterf'; 
EVENT: 'event'; 
NOT: 'not'; 
ELIMTRUE: 'elimtrue'; 
FREE: 'free'; 
CLAUSES: 'clauses'; 
SUCHTHAT: 'suchthat'; 
NOUNIF: 'nounif' | 'noselect'; 
SELECT: 'select'; 
PHASE: 'phase'; 
BARRIER: 'sync'; 
AMONG: 'among'; 
WEAKSECRET: 'weaksecret'; 
EQUIVALENCE: 'equivalence'; 
OTHERWISE: 'otherwise'; 
CHOICE: 'choice' | 'diff'; 
LEMMA: 'lemma'; 
AXIOM: 'axiom'; 
RESTRICTION: 'restriction'; 
FOR: 'for';

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

AT: '@';

OPTIMIF: 'optim-if';
ISCST: 'is-cst';

COUNT: '#';
COMMA: ',';
LPAREN: '(';
RPAREN: ')';
LBRACKET: '[';
RBRACKET: ']';
LBRACE: '{';
RBRACE: '}';
BAR: '|';
OR: '||';
WEDGE: '&&';
SEMI: ';';
REPL: '!';
EQUAL: '=';
SLASH: '/';
DOT: '.';
STAR: '*';
COLON: ':';
PLUS: '+';
MINUS: '-';
POWER: '^';
RED: '->';
LEQ: '<=';
EQUIV: '<->';
EQUIVEQ: '<=>';
DIFF: '<>';
BEFORE: '==>';
LESS: '<';
GEQ: '>=';
GREATER: '>';
LEFTARROW: '<-';
RANDOM: '<-R';
UNDERSCORE: '_';
INJEVENT: 'inj-event';

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

