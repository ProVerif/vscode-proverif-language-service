parser grammar ProverifParser;

options { tokenVocab = ProverifLexer; }

proverifFile
    : declaration* PROCESS process EOF
    ;

declaration
    : channelDeclaration
    | freeDeclaration
    ;

channelDeclaration
    : CHANNEL identifierSequence DOT
    ;

freeDeclaration
    : FREE identifierSequence COLON typeId
    ;

process
    : IN LPAREN pterm COMMA pterm RPAREN
    | OUT LPAREN pterm COMMA pterm RPAREN
    ;

pterm
    : identifier
    | LPAREN pterm* RPAREN
    ;

identifierSequence
    : identifier (COMMA identifier)*
    ;

identifier: Identifier ;

typeId: Identifier ;

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
