parser grammar ProverifParser;

options { tokenVocab = ProverifLexer; }

proverifFile
    : declaration* PROCESS process EOF
    ;

/**
declarations
**/
declaration
    : channelDeclaration
    | freeDeclaration
    ;

typeDeclaration
    : TYPE ident options DOT
    ;

channelDeclaration
    : CHANNEL ident_seq_plus DOT
    ;

freeDeclaration
    : FREE ident_seq_plus COLON typeid DOT
    ;



/**
process
**/
process
    : IN LPAREN pterm COMMA pterm RPAREN
    | OUT LPAREN pterm COMMA pterm RPAREN
    ;


/**
terms
*/
term
    : ident
    | nat
    | LPAREN term* RPAREN
    | ident LPAREN term* RPAREN
    | term plus_minus nat
    | nat ADD term
    | term infix term
    | NOT LPAREN term RPAREN
    ;

pterm2
    : ident
    | LPAREN pterm* RPAREN
    | ident LPAREN term* RPAREN
    | CHOICE LSQUARE pterm COMMA pterm RSQUARE
    | pterm plus_minus nat
    | nat ADD pterm
    | pterm infix pterm
    | NOT LPAREN pterm RPAREN
    | NEW ident (LSQUARE ident* RSQUARE)? COLON typeid SEMICOLON pterm
    ;

ptermseq
    : (pterm COMMA)*
    ;


pterm
    : IDENT LPAREN ptermseq RPAREN
    | CHOICE LBRACKET pterm COMMA pterm RBRACKET
    | IDENT
    | INT
    | pterm MINUS INT
    | pterm PLUS INT
    | INT PLUS pterm
    | pterm LESS pterm
    | pterm GREATER pterm
    | pterm LEQ pterm
    | pterm GEQ pterm
    | pterm EQUAL pterm
    | pterm DIFF pterm
    | NOT LPAREN pterm RPAREN
    | pterm OR pterm
    | pterm WEDGE pterm
    | NEW IDENT newarg COLON typeid SEMI pterm
    | IDENT RANDOM typeid SEMI pterm
    | IF pterm THEN pterm optelseterm
    | LET tpattern EQUAL pterm IN pterm optelseterm
    | basicpattern LEFTARROW pterm SEMI pterm
    | LET nevartype SUCHTHAT pterm IN pterm optelseterm
    | EVENT IDENT optargs newarg SEMI pterm
    | INSERT IDENT LPAREN ptermseq RPAREN SEMI pterm
    | GET IDENT LPAREN tpatternseq RPAREN optsuchthat options IN pterm optelseterm
    | LPAREN ptermseq RPAREN
    ;


/**
non-terminals
*/

nat
    : Number
    ;

int
    : Number
    | SUB Number
    ;

typeid
    : ident | CHANNEL
    ;

options_
    : LSQUARE ident_seq_plus RSQUARE
    ;

plus_minus
    : SUB
    | ADD
    ;

infix
    : LESS
    | GREATER
    | LESS_EQUAL
    | GREATER_EQUAL
    | NOT_EQUAL
    | EQUAL
    | CONJUNCTION
    | DISJUNCTION
    ;

/**
base
*/
ident_seq_plus
    : ident (COMMA ident)*
    ;

ident_seq_
    : (COMMA ident)*
    ;

ident: Identifier ;
