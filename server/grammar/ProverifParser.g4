parser grammar ProverifParser;

options { tokenVocab = ProverifLexer; }

proverifFile
    : declaration* PROCESS process EOF
    ;

declaration
    : CHANNEL identifier_sequence DOT
    | FREE identifier_sequence COLON type_id
    ;

process
    : IN LPAREN pterm COMMA pterm RPAREN
    | OUT LPAREN pterm COMMA pterm RPAREN
    ;

pterm
    : Identifier
    | LPAREN pterm* RPAREN
    ;

identifier_sequence
    : Identifier (COMMA Identifier)*
    ;

type_id: Identifier ;

expression
    : parenthesizedExpression
    | literalConstant
    ;

parenthesizedExpression
    : LPAREN expression RPAREN
    ;

literalConstant
    : BooleanLiteral
    | Number
    ;
