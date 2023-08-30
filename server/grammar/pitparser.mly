# taken from commit ebbc776a8cfe521d21801f85e72f3670693152a1
%{

open Parsing_helper
open Ptree
open Pitptree

let zero () = PIdent (("0",parse_extent())), parse_extent()

let rec unfold_int t = function
  | 0 -> t
  | n -> PFunApp(("+", parse_extent()), [unfold_int t (n-1)]), parse_extent()

 let rec unfold_int_minus t = function
   | 0 -> t
   | n -> PFunApp(("- "^(string_of_int n), parse_extent()), [t]), parse_extent()

let gzero () = PGIdent (("0",parse_extent())), parse_extent()

let rec unfold_gint t = function
  | 0 -> t
  | n -> PGFunApp(("+", parse_extent()), [unfold_gint t (n-1)], None), parse_extent()

let pzero () = PPIdent (("0",parse_extent())), parse_extent()

let rec unfold_pint t = function
  | 0 -> t
  | n -> PPFunApp(("+", parse_extent()), [unfold_pint t (n-1)]), parse_extent()

let rec unfold_pint_minus t = function
  | 0 -> t
  | n -> PPFunApp(("- "^(string_of_int n), parse_extent()), [t]), parse_extent()

let pat_zero () = PPatFunApp (("0",parse_extent()), [])

let rec unfold_pat_int t = function
  | 0 -> t
  | n -> PPatFunApp(("+", parse_extent()), [unfold_pat_int t (n-1)])

let pfg_zero () = PFGIdent (("0",parse_extent())), parse_extent()

let rec unfold_pfg_int t = function
  | 0 -> t
  | n -> PFGFunApp(("+", parse_extent()), [unfold_pfg_int t (n-1)]), parse_extent()


exception Syntax

%}

%token CHOICE
%token STAR
%token COMMA
%token LPAREN
%token RPAREN
%token LBRACKET
%token RBRACKET
%token BAR
%token SEMI
%token NEW
%token OUT
%token IN
%token AT
%token <Pitptree.ident> IDENT
%token <Pitptree.ident> TAG
%token <Pitptree.ident> STRING
%token <Pitptree.ident> PROJECTION
%token <Parsing_helper.extent> UNDERSCORE
%token <int> INT
%token REPL
%token IF
%token THEN
%token ELSE
%token EQUAL
%token FUN
%token EQUATION
%token REDUCTION
%token PREDICATE
%token PROCESS
%token SLASH
%token DOT
%token EOF
%token LET
%token QUERY
%token BEFORE
%token PUTBEGIN
%token NONINTERF
%token EVENT
%token NOT
%token ELIMTRUE
%token FREE
%token SUCHTHAT
%token CLAUSES
%token RED
%token EQUIV
%token EQUIVEQ
%token WEDGE
%token DIFF
%token COLON
%token NOUNIF
%token SELECT
%token PHASE
%token BARRIER
%token AMONG
%token WEAKSECRET
%token PARAM
%token ORTEXT
%token FAIL
%token LESS
%token GREATER
%token GEQ
%token PLUS
%token MINUS

/* Typed front-end only */
%token TYPE
%token SET
%token FORALL
%token CONST
%token INJEVENT
%token OR
%token CHANNEL
%token LETFUN
%token DEFINE
%token EXPAND
%token YIELD
%token LEQ
%token PROBA
  %token LETPROBA
  %token OPTIMIF
  %token ISCST
  %token COUNT
  %token <float> FLOAT
%token LBRACE
%token RBRACE
%token PROOF
%token IMPLEMENTATION
%token EQUIVALENCE
%token OTHERWISE
%token FOREACH
%token DO
%token SECRET
%token PUBLICVARS
%token RANDOM
%token LEFTARROW
%token POWER

/* Lemmas and axioms */
%token LEMMA
%token AXIOM
%token RESTRICTION
%token FOR

/* Tables of keys */
%token TABLE
%token INSERT
%token GET

/* Precedence (from low to high) and associativities */
%nonassoc OPTIMIF
%nonassoc BEFORE
%right BAR
%right OR
%right WEDGE
%nonassoc EQUAL
%nonassoc DIFF
%nonassoc LEQ
%nonassoc GEQ
%nonassoc GREATER
%nonassoc LESS
%left PLUS MINUS
%left STAR SLASH /*MUL DIV*/
%nonassoc REPL
%nonassoc UNARYMINUS
%nonassoc POWER

%start all
%type <Pitptree.tdecl list * Pitptree.tprocess_e * Pitptree.tprocess_e option> all

%start lib
%type <Pitptree.tdecl list> lib

%start permut
%type <Pitptree.ident list list> permut

%start order
%type <Pitptree.ident list> order

%start term
%type <Pitptree.term_e> term

%%
/*** Typed front-end ***/

lib:
    TYPE IDENT options DOT lib
      { (* Options are ignored, they are supported for compatibility with
             CryptoVerif only *)
          TTypeDecl($2) :: $5 }
  | FUN IDENT LPAREN typeidseq RPAREN COLON typeid options DOT lib
      { (TFunDecl($2, $4, $7, $8)) :: $10 }
  |	FUN IDENT LPAREN typeidseq RPAREN COLON typeid REDUCTION treducmayfail options DOT lib
      { (TReducFail($2,$4,$7,$9, $10)) :: $12 }
  |	REDUCTION treduc options DOT lib
      { (TReduc($2,$3)) :: $5 }
  | CONST neidentseq COLON typeid options DOT lib
      { (List.map (fun x -> TConstDecl(x, $4, $5)) $2) @ $7 }
  |	EQUATION eqlist options DOT lib
      { (TEquation($2, $3)) :: $5 }
  | EVENT IDENT options DOT lib
      { (TEventDecl($2, [],$3)) :: $5 }
  | EVENT IDENT LPAREN typeidseq RPAREN options DOT lib
      { (TEventDecl($2, $4, $6)) :: $8 }
  | PREDICATE IDENT LPAREN typeidseq RPAREN options DOT lib
      { (TPredDecl($2, $4, $6)) :: $8 }
  | PREDICATE IDENT options DOT lib
      { (TPredDecl($2, [], $3)) :: $5 }
  | TABLE IDENT LPAREN typeidseq RPAREN DOT lib
      { (TTableDecl($2, $4)) :: $7 }
  |	LET IDENT EQUAL tprocess DOT lib
      { (TPDef($2,[],$4)) :: $6 }
  | LET IDENT LPAREN mayfailvartypeseq RPAREN EQUAL tprocess DOT lib
      { (TPDef($2,$4,$7)) :: $9 }
  | LETFUN IDENT EQUAL pterm DOT lib
      { (TLetFun($2,[],$4)) :: $6 }
  | LETFUN IDENT LPAREN mayfailvartypeseq RPAREN EQUAL pterm DOT lib
      { (TLetFun($2,$4,$7)) :: $9 }
  | SET IDENT EQUAL settings DOT lib
      { (TSet($2,$4)) :: $6 }
  | NOUNIF nevartype SEMI tfnebindingseq nounif_value options DOT lib
      { (TNoUnif ($2, $4, $5, $6)) :: $8 }
  | NOUNIF tfnebindingseq nounif_value options DOT lib
      { (TNoUnif ([], $2, $3, $4)) :: $6 }
  | SELECT nevartype SEMI tfnebindingseq select_value options DOT lib
      { (TNoUnif ($2, $4, $5, $6)) :: $8 }
  | SELECT tfnebindingseq select_value options DOT lib
      { (TNoUnif ([], $2, $3, $4)) :: $6 }
  | QUERY nevartype SEMI tqueryseq options DOT lib
      { (TQuery($2,$4,$5)) :: $7 }
  | QUERY tqueryseq options DOT lib
      { (TQuery([],$2,$3)) :: $5 }
  |	NONINTERF nevartype SEMI niseq DOT lib
      { (TNoninterf($2, $4)) :: $6 }
  |	NONINTERF niseq DOT lib
      { (TNoninterf([], $2)) :: $4 }
  |	WEAKSECRET IDENT DOT lib
      { (TWeaksecret($2)) :: $4 }
  |	NOT nevartype SEMI gterm DOT lib
      { (TNot($2, $4)) :: $6 }
  |	NOT gterm DOT lib
      { (TNot([], $2)) :: $4 }
  | PARAM neidentseq options DOT lib
      { (* Supported for compatility with CryptoVerif only *)
        $5 }
  | PROBA IDENT probaargs options DOT lib
      { (* Supported for compatility with CryptoVerif only *)
        $6 }
  | LETPROBA IDENT letprobaargs EQUAL probaf DOT lib
      { (* Supported for compatility with CryptoVerif only *)
        $7 }
  | PROOF LBRACE proof RBRACE lib
      { (* Supported for compatility with CryptoVerif only *)
        $5 }
  | IMPLEMENTATION impllist DOT lib
      { (* Supported for compatility with CryptoVerif only *)
        $4 }
  | ELIMTRUE nemayfailvartypeseq SEMI term DOT lib
      { (TElimtrue ($2,$4)) :: $6 }
  | ELIMTRUE term DOT lib
      { (TElimtrue ([],$2)) :: $4 }
  | CHANNEL neidentseq DOT lib
      { (* For compatibility with CryptoVerif, allow
            channel c1...cn.
           as a synonym for
            free c1...cn:channel. *)
        (List.map (fun x -> TFree(x, ("channel", dummy_ext), [])) $2) @ $4 }
  | FREE neidentseq COLON typeid options DOT lib
      { (List.map (fun x -> TFree(x, $4, $5)) $2) @ $7 }
  | CLAUSES tclauses lib
      { (TClauses($2)) :: $3 }
  | DEFINE IDENT LPAREN typeidseq RPAREN LBRACE lib RBRACE lib
      { (TDefine($2, $4, $7)) :: $9 }
  | EXPAND IDENT LPAREN typeidseq RPAREN DOT lib
      { (TExpand($2, $4)) :: $7 }
  | lemma nevartype SEMI tlemmaseq options DOT lib
      { (TLemma($1,$2,$4,$5)) :: $7 }
  | lemma tlemmaseq options DOT lib
      { (TLemma($1,[],$2,$3)) :: $5 }
  |
      { [] }

settings:
  | IDENT 
      { S $1 }
  | STRING
      { S $1 }
  | INT
      { I $1 }
  | INT MINUS INT
      { Inter($1,$3) }

lemma:
    LEMMA
      { KLemma }
  | AXIOM
      { KAxiom }
  | RESTRICTION
      { KRestriction }

all:
|       lib PROCESS tprocess EOF
	{ $1, $3, None }
|	lib EQUIVALENCE tprocess tprocess EOF
	{ $1, $3, Some $4 }

/* Proofs (for CryptoVerif compatibility only) */

prooftoken:
        IDENT
        { $1 }
|       STRING
        { $1 }
|       INT
        { string_of_int $1, parse_extent() }
|       STAR
        { "*", parse_extent() }
|       DOT
        { ".", parse_extent() }
|       SET
        { "set", parse_extent() }
|       INSERT
        { "insert", parse_extent() }
|       EQUAL
        { "=", parse_extent() }
|       COMMA
        { ",", parse_extent() }
|       LPAREN
        { "(", parse_extent() }
|       RPAREN
        { ")", parse_extent() }

proofcommand:
        prooftoken
        { [$1] }
|       prooftoken proofcommand
        { $1 :: $2 }

proof:
        proofcommand
	{ [$1] }
|       proofcommand SEMI proof
        { $1 :: $3 }

/* Implementation annotations (for CryptoVerif compatibility only) */

impllist:
        impl
        { [$1] }
|       impl SEMI impllist
        { $1 :: $3 }

impl:
        TYPE IDENT EQUAL cvtypeid typeoptions
        { () }
|       FUN IDENT EQUAL STRING functionoptions
        { () }
|       TABLE IDENT EQUAL STRING
        { () }
|       CONST IDENT EQUAL STRING
        { () }

cvtypeid:
        INT
        { () }
|       STRING
        { () }

stringlistne:
        STRING
        { [$1] }
|       STRING COMMA stringlistne
        { $1::$3 }

typeopt:
        IDENT EQUAL stringlistne
        { $1,$3 }
|       PREDICATE EQUAL stringlistne /* Needed because "pred" is a keyword in ProVerif and CryptoVerif uses it here as identifier */
        { ("pred",parse_extent()),$3 }

typeoptlist:
|       typeopt
        { [$1] }
|       typeopt SEMI typeoptlist
        { $1::$3 }

typeoptions:
|       LBRACKET typeoptlist RBRACKET
        { $2 }
|
        { [] }

funopt:
        IDENT EQUAL STRING
        { $1,$3 }

funoptlist:
|       funopt
        { [$1] }
|       funopt SEMI funoptlist
        { $1::$3 }

functionoptions:
        LBRACKET funoptlist RBRACKET
        { $2 }
|
        { [] }

    /* proba arguments (for CryptoVerif compatibility only) */

probaargs:
    { None }
|   LPAREN dimlist RPAREN
    { Some $2 }

dimlist:
    { [] }
|   nedimlist
    { $1 }

nedimlist:
    dimext
    { [$1] }
|   dimext COMMA nedimlist
    { $1 :: $3 }

dimext:
    dim
    { $1, parse_extent() }

/* A dimension is represented as a pair (t,l) corresponding to time^t * length^l */
dim:
    IDENT poweropt
    { (0, 0) }
|   dim STAR /*MUL*/ dim
    { (0,0) }
|   dim SLASH /*DIV*/ dim
    { (0,0) }

poweropt:
    { 1 }
|   POWER INT
    { $2 }
|   POWER MINUS INT
    { -$3 }

letprobaargs:
    { [] }
|   LPAREN probaarglist RPAREN
    { $2 }

probaarglist:
    { [] }
|   neprobaarglist
    { $1 }

neprobaarglist:
    vardim
    { $1 }
|   vardim COMMA neprobaarglist
    { $1 @ $3 }

vardim:
    neidentseq COLON dimext
    { List.map (fun i -> (i,$3)) $1 }



probaf:
    LPAREN probaflist RPAREN /*more general than what is really allowed
    to encode TIME/LENGTH LPAREN LPAREN identlist RPAREN probaflistopt RPAREN */
        { () }
|       MINUS probaf  %prec UNARYMINUS
        { () }
|       probaf PLUS /*ADD*/ probaf
        { () }
|       probaf MINUS /*SUB*/ probaf
        { () }
|       probaf STAR /*MUL*/ probaf
        { () }
|       probaf SLASH /*DIV*/ probaf
        { () }
|       probaf POWER INT
        { () }
|       probaf POWER MINUS /*SUB*/ INT
        { () }
|       IDENT LPAREN probaflist RPAREN
        { () }
|       IDENT /*TIME*/ LPAREN LET IDENT probaflistopt RPAREN
        { () }
|       IDENT /*TIME*/ LPAREN EQUAL IDENT probaflistopt RPAREN
        { () }
|       IDENT /*TIME*/ LPAREN LET LPAREN identlist RPAREN probaflistopt RPAREN
        { () }
|       IDENT /*TIME*/ LPAREN OUT IDENT probaflistopt RPAREN
        { () }
|       IDENT /*TIME*/ LPAREN OUT LBRACKET neidentseq RBRACKET IDENT probaflistopt RPAREN
        { () }
|       IDENT /*TIME*/ LPAREN IN INT RPAREN
        { () }
|       OPTIMIF probaoptimcond THEN probaf ELSE probaf %prec OPTIMIF
        { () }
|       IDENT
        { () }
|       COUNT IDENT
        { () }
|       BAR IDENT BAR
        { () }
|       IDENT /*TIME*/ LPAREN REPL RPAREN
        { () }
|       IDENT /*TIME*/ LPAREN FOREACH RPAREN
        { () }
|       IDENT /*TIME*/ LPAREN LBRACKET INT RBRACKET RPAREN
        { () }
|       IDENT /*TIME*/ LPAREN WEDGE RPAREN
        { () }
|       IDENT /*TIME*/ LPAREN OR RPAREN
        { () }
|       IDENT /*TIME*/ LPAREN NEW IDENT RPAREN
        { () }
|       IDENT /*TIME*/ LPAREN RANDOM IDENT RPAREN
        { () }
|       IDENT /*TIME*/ LPAREN IF RPAREN
        { () }
|       IDENT /*TIME*/ LPAREN IDENT/*FIND*/ INT RPAREN
        { () }
|       INT
        { ()  }
|       FLOAT
        { ()  }
/* |       MAXLENGTH LPAREN term RPAREN (not supported) */


identlist:

        { [] }
|       neidentseq
        { $1 }

probaoptimcond:
    LPAREN probaoptimcond RPAREN
    { $2 }
|   ISCST LPAREN probaf RPAREN
    { () }
|   probaf EQUAL probaf
    { () }
|   probaf LEQ probaf
    { () }
|   probaf GEQ probaf
    { () }
|   probaf LESS probaf
    { () }
|   probaf GREATER probaf
    { () }
|   probaoptimcond WEDGE probaoptimcond
    { () }
|   probaoptimcond OR probaoptimcond
    { () }
|   IDENT LPAREN probaoptimcond RPAREN
    { () }

probaflistopt:
       COMMA probaflist
       { $2 }
|
       { [] }

probaflist:
       probaf
       { [$1] }
|      probaf COMMA probaflist
       { $1 :: $3 }

/* Options, environments, ... */

options:
    LBRACKET optionseq RBRACKET
      { $2 }
  |
      { [] }

singleoption:
    IDENT
      { $1, None }
  | IDENT EQUAL IDENT
      { $1, Some [$3] }
  | IDENT EQUAL LBRACE neidentseq RBRACE
      { $1, Some $4 }

optionseq:
    singleoption COMMA optionseq
      { $1 :: $3 }
  | singleoption
      { [$1] }

neidentseq:
  IDENT COMMA neidentseq
    { $1 :: $3 }
| IDENT
    { [$1] }

newarg:

    { None }
| LBRACKET RBRACKET
    { Some [] }
| LBRACKET neidentseq RBRACKET
    { Some ($2) }

onevartype:
    /* We make explicit the first IDENT to avoid a shift/reduce conflict
    on COLON between "LET nevartype SUCHTHAT" and "LET tpattern EQUAL"
    in case we have "let x:T ..." */
    IDENT COMMA neidentseq COLON typeid
    { List.map (fun x -> (x,$5)) ($1::$3) }
|   IDENT COLON typeid
    { [($1,$3)] }

nevartype:
        onevartype COMMA nevartype
        { $1 @ $3 }
|
        onevartype
        { $1 }

forallvartype:
        FORALL nevartype SEMI
        { $2 }
|
        { [] }

typeid:
        IDENT
        { $1 }
|       CHANNEL
        { (* channel is allowed as a type, even though it is also a keyword for the declaration channel c1...cn. *)
          "channel", parse_extent() }

typeidseq:
        netypeidseq
        { $1 }
|
        { [] }

netypeidseq:
  typeid COMMA netypeidseq
    { $1 :: $3 }
| typeid
    { [$1] }

/* Terms */

term:
|	FAIL
	{ PFail, parse_extent () }
|	IDENT LPAREN termseq RPAREN
        { PFunApp ($1, $3), parse_extent() }
|       PROJECTION LPAREN term RPAREN
        { PProj ($1,$3), parse_extent() }
|       CHOICE LBRACKET term COMMA term RBRACKET
        { Param.has_choice := true;
	  PFunApp(("choice", parse_extent()), [$3; $5]), parse_extent() }
|	IDENT
	{ PIdent ($1), parse_extent() }
|       INT
        { Param.has_integer := true; unfold_int (zero ()) $1 }
|       term MINUS INT
        { Param.has_integer := true; unfold_int_minus $1 $3 }
|       term PLUS INT
        { Param.has_integer := true; unfold_int $1 $3 }
|       INT PLUS term
        { Param.has_integer := true; unfold_int $3 $1 }
|       term EQUAL term
        { PFunApp(("=", parse_extent()), [$1; $3]), parse_extent() }
|       term DIFF term
        { PFunApp(("<>", parse_extent()), [$1; $3]), parse_extent() }
|       NOT LPAREN term RPAREN
        { PFunApp(("not", parse_extent()), [$3]), parse_extent() }
|       term OR term
        { PFunApp(("||", parse_extent()), [$1; $3]), parse_extent() }
|       term WEDGE term
        { PFunApp(("&&", parse_extent()), [$1; $3]), parse_extent() }
|	LPAREN termseq RPAREN
	{ match $2 with
	  [t] -> t   (* Allow parentheses for priorities of infix operators;
			Tuples cannot have one element. *)
	| l -> PTuple (l), parse_extent() }

netermseq:
	term COMMA netermseq
	{ $1 :: $3 }
|	term
	{ [$1] }

termseq:
        netermseq
        { $1 }
|
        { [] }

/* Noninterf */

niseq:
  /* We need to consider all these cases in a single non-terminal
     to avoid a shift/reduce conflict on COMMA between
    "NONINTERF nevartype SEMI niseq DOT lib" and
    "NONINTERF niseq DOT lib"
    in case we have "noninterf x,y ...". We can decide which option
    it is only when we meet a COLON (first option: noninterf x,...,y:T...)
    a DOT (second option: noninterf x,...,y.), or AMONG (second option),
    so we must not reduce a non-terminal before that. */
  IDENT AMONG LPAREN netermseq RPAREN COMMA niseq
    { ($1,Some $4) :: $7 }
| IDENT AMONG LPAREN netermseq RPAREN
    { [$1,Some $4] }
| IDENT COMMA niseq
    { ($1,None) :: $3 }
| IDENT
    { [$1,None] }

/* Lemmas */

opt_publivars_ror:
    { None, [] }
  | FOR LBRACE PUBLICVARS neidentseq RBRACE
    { None, $4 }
  | FOR LBRACE SECRET IDENT optpublicvars LBRACKET IDENT RBRACKET RBRACE
    { Some ($4,$7), $5 }

tlemmaseq:
    gterm opt_publivars_ror SEMI tlemmaseq
      { let (ror,pubvars) = $2 in ($1,ror,pubvars) :: $4 }
  | gterm opt_publivars_ror
      { let (ror,pubvars) = $2 in [$1,ror,pubvars] }

/* Queries */

tqueryseq:
    tquery SEMI tqueryseq
    { $1 :: $3 }
|   tquery
    { [$1] }

tquery:
    gterm optpublicvars
    { PRealQuery($1,$2), parse_extent() }
|   SECRET IDENT optpublicvars options
    { PQSecret ($2,$3,$4), parse_extent() }
|   PUTBEGIN EVENT COLON neidentseq
    { PPutBegin(false, $4), parse_extent() }
|   PUTBEGIN INJEVENT COLON neidentseq
    { PPutBegin(true, $4), parse_extent() }

optpublicvars:

    { [] }
|   PUBLICVARS neidentseq
    { $2 }

optatident:

    { None }
|   AT IDENT
    { Some $2 }

gterm:
	IDENT LPAREN gtermseq RPAREN optatident
	{ PGFunApp ($1, $3, $5), parse_extent() }
|	IDENT
	 { PGIdent ($1), parse_extent() }
|       INT
        { Param.has_integer := true; unfold_gint (gzero ()) $1 }
|       gterm PLUS INT
        { Param.has_integer := true; unfold_gint $1 $3 }
|       INT PLUS gterm
        { Param.has_integer := true; unfold_gint $3 $1 }
|       gterm LEQ gterm
        { Param.has_integer := true; PGFunApp(("<=", parse_extent()), [$1; $3], None), parse_extent() }
|       gterm GEQ gterm
        { Param.has_integer := true; PGFunApp((">=", parse_extent()), [$1; $3], None), parse_extent() }
|       gterm LESS gterm
        { Param.has_integer := true; PGFunApp(("<", parse_extent()), [$1; $3], None), parse_extent() }
|       gterm GREATER gterm
        { Param.has_integer := true; PGFunApp((">", parse_extent()), [$1; $3], None), parse_extent() }
|       IDENT LPAREN gtermseq RPAREN PHASE INT optatident
        { PGPhase($1, $3, $6, $7), parse_extent() }
|       TABLE LPAREN gterm RPAREN PHASE INT optatident
        { PGPhase(("table", parse_extent()), [$3], $6, $7), parse_extent() }
|       gterm EQUAL gterm
        { PGFunApp(("=", parse_extent()), [$1; $3], None), parse_extent() }
|       gterm DIFF gterm
        { PGFunApp(("<>", parse_extent()), [$1; $3], None), parse_extent() }
|       NOT LPAREN gterm RPAREN
        { PGFunApp(("not", parse_extent()), [$3], None), parse_extent() }
|       gterm OR gterm
        { PGFunApp(("||", parse_extent()), [$1; $3], None), parse_extent() }
|       gterm WEDGE gterm
        { PGFunApp(("&&", parse_extent()), [$1; $3], None), parse_extent() }
|       CHOICE LBRACKET gterm COMMA gterm RBRACKET
        { PGFunApp(("choice", parse_extent()), [$3; $5], None), parse_extent() }
|       EVENT LPAREN gtermseq RPAREN optatident
        { PGFunApp(("event",parse_extent()), $3, $5), parse_extent() }
|       INJEVENT LPAREN gtermseq RPAREN optatident
        { PGFunApp(("inj-event",parse_extent()), $3, $5), parse_extent() }
|       TABLE LPAREN gterm RPAREN optatident
        { PGFunApp(("table",parse_extent()), [$3], $5), parse_extent() }
|       gterm BEFORE gterm
        { PGFunApp(("==>", parse_extent()), [$1;$3], None), parse_extent() }
|	LPAREN gtermseq RPAREN
	{ match $2 with
	  [t] -> t   (* Allow parentheses for priorities of infix operators;
			Tuples cannot have one element. *)
	| l -> PGTuple (l), parse_extent() }
|       NEW IDENT LBRACKET bindingseq RBRACKET
        { PGName ($2, $4), parse_extent() }
|       NEW IDENT
        { PGName ($2, []), parse_extent() }
|       LET IDENT EQUAL gterm IN gterm
        { PGLet($2, $4, $6), parse_extent() }
| IDENT LEFTARROW gterm SEMI gterm
     { PGLet($1,$3,$5), parse_extent() }

negtermseq:
	gterm COMMA negtermseq
	{ $1 :: $3 }
|	gterm
	{ [$1] }

gtermseq:
        negtermseq
        { $1 }
|
        { [] }


nesbindingseq:
        REPL INT EQUAL gterm SEMI nesbindingseq
        { (("!" ^ (string_of_int ($2)), parse_extent()), $4) :: $6 }
|       REPL INT EQUAL gterm
        { [(("!" ^ (string_of_int ($2)), parse_extent()), $4)] }
|       IDENT EQUAL gterm SEMI nesbindingseq
        { ($1, $3) :: $5 }
|       IDENT EQUAL gterm
        { [($1, $3)] }

bindingseq:
        nesbindingseq
        { $1 }
|
        { [] }

/* Nounif */

tfnebindingseq:
        LET IDENT EQUAL gformat IN tfnebindingseq
        { BFLet($2, $4, $6) }
| IDENT LEFTARROW gformat SEMI tfnebindingseq
     { BFLet($1,$3,$5) }
|       IDENT LPAREN gformatseq RPAREN optphase
        { BFNoUnif($1,$3,$5) }
|       IDENT
        { BFNoUnif($1,[],-1) }
|       TABLE LPAREN gformatseq RPAREN optphase
        { BFNoUnif(("table", parse_extent()),$3,$5) }
|       EVENT LPAREN gformatseq RPAREN optphase
        { BFNoUnif(("event", parse_extent()),$3,$5) }

optphase:
    PHASE INT
    { $2 }
|
    { -1 }

nounif_value:
    SLASH INT
    { NoUnifValue(-$2) }
|   SLASH MINUS INT
    { NoUnifValue $3 }
|
    { NoUnifNegDefault }

select_value:
    SLASH INT
    { NoUnifValue($2) }
|   SLASH MINUS INT
    { NoUnifValue(-$3) }
|
    { NoUnifPosDefault }

gformat:
	IDENT LPAREN gformatseq RPAREN
	{ PFGFunApp ($1, $3), parse_extent() }
|       CHOICE LBRACKET gformat COMMA gformat RBRACKET
	{ PFGFunApp (("choice", parse_extent()), [$3; $5]), parse_extent() }
| IDENT
    { PFGIdent ($1), parse_extent() }
| INT
    { Param.has_integer := true; unfold_pfg_int (pfg_zero ()) $1 }
| gformat PLUS INT
    { Param.has_integer := true; unfold_pfg_int $1 $3 }
| INT PLUS gformat
    { Param.has_integer := true; unfold_pfg_int $3 $1 }
|	LPAREN gformatseq RPAREN
	{ match $2 with
	  [t] -> t   (* Allow parentheses for priorities of infix operators;
			Tuples cannot have one element. *)
	| l -> PFGTuple ($2), parse_extent() }
|       NEW IDENT LBRACKET fbindingseq RBRACKET
        { PFGName ($2, $4), parse_extent() }
|       NEW IDENT
        { PFGName ($2, []), parse_extent() }
|       STAR IDENT
        { PFGAny ($2), parse_extent() }
|       LET IDENT EQUAL gformat IN gformat
        { PFGLet($2, $4, $6), parse_extent() }
| IDENT LEFTARROW gformat SEMI gformat
     { PFGLet($1,$3,$5), parse_extent() }


negformatseq:
	gformat COMMA negformatseq
	{ $1 :: $3 }
|	gformat
	{ [$1] }

gformatseq:
        negformatseq
        { $1 }
|
        { [] }


fnesbindingseq:
        REPL INT EQUAL gformat SEMI fnesbindingseq
        { (("!" ^ (string_of_int ($2)), parse_extent()), $4) :: $6 }
|       REPL INT EQUAL gformat
        { [(("!" ^ (string_of_int ($2)), parse_extent()), $4)] }
|       IDENT EQUAL gformat SEMI fnesbindingseq
        { ($1, $3) :: $5 }
|       IDENT EQUAL gformat
        { [($1, $3)] }

fbindingseq:
        fnesbindingseq
        { $1 }
|
        { [] }

/* Rewrite rules */

optorfail:
    ORTEXT FAIL
    { true }
|
    { false}

mayfailvartype:
	neidentseq COLON typeid optorfail
	{ List.map (fun x -> (x,$3,$4)) $1 }

nemayfailvartypeseq:
	mayfailvartype COMMA nemayfailvartypeseq
	{ $1 @ $3 }
|
	mayfailvartype
	{ $1 }

mayfailvartypeseq:
        nemayfailvartypeseq
        { $1 }
|
        { [] }

forallmayfailvartype:
	FORALL nemayfailvartypeseq SEMI
	{ $2 }
|
	{ [] }

extended_equation:
 | LET IDENT EQUAL term IN extended_equation
     { EELet($2,$4,$6) }
 | IDENT LEFTARROW term SEMI extended_equation
     { EELet($1,$3,$5) }
 | term
    { EETerm($1) }

treducotherwise:
	OTHERWISE forallmayfailvartype extended_equation treducotherwise
	{ ($2,$3) :: $4 }
|	OTHERWISE forallmayfailvartype extended_equation
	{ [$2,$3] }

treducmayfail:
	forallmayfailvartype extended_equation treducotherwise
	{ ($1,$2) :: $3 }
|	forallmayfailvartype extended_equation
	{ [$1,$2] }

treduc:
	forallvartype extended_equation SEMI treduc
	{ ($1,$2) :: $4 }
|	forallvartype extended_equation
	{ [$1,$2] }

/* Equations */

eqlist:
    forallvartype extended_equation
    { [($1, $2)] }
|   forallvartype extended_equation SEMI eqlist
    { ($1, $2)::$4 }

/* Clauses */

tclause:
        term RED term
        { PClause($1,$3) }
|       term
        { PFact($1) }
|       term EQUIV term
        { PEquiv($1,$3,true) }
|       term EQUIVEQ term
        { PEquiv($1,$3,false) }

tclauses:
	forallmayfailvartype tclause SEMI tclauses
	{ ($1,$2) :: $4 }
|	forallmayfailvartype tclause DOT
	{ [$1,$2] }

/* CryptoVerif implementation annotations
   Just ignored by Proverif */

programoptions:
        LBRACKET progoptlist RBRACKET
        { $2 }
|
        { [] }

progoptlist:
        progopt
        { [$1] }
|       progopt COMMA progoptlist
        { $1 :: $3 }

progopt:
        IDENT GREATER IDENT
        { ("Write", $1,$3) }
|       IDENT LESS IDENT
        { ("Read", $1,$3) }

progbegin:
        IDENT programoptions LBRACE
        {($1,$2)}

progend:
        RBRACE
        {true}
|
        {false}

/* Process */

syncopt:

    { None }
|   LBRACKET BARRIER COLON IDENT IDENT IDENT RBRACKET
    { match $4, $5, $6 with
    | ("no",_), ("tag",_), ("prefix", _) -> Some ("",parse_extent())
    | ("tag",_), ("prefix",_), id -> Some id
    | _ -> raise Parsing.Parse_error }

tprocess:
  | progbegin tprocess
      { $2 (* CryptoVerif implementation annotations ignored *) }
  | LPAREN tprocess RPAREN
      { $2 }
  | IDENT syncopt
      { PLetDef ($1, [], $2), parse_extent() }
  | IDENT LPAREN ptermseq RPAREN syncopt
      { PLetDef ($1, $3, $5), parse_extent() }
  | REPL tprocess %prec REPL
      { PRepl $2, parse_extent() }
  | REPL IDENT LEQ IDENT tprocess %prec REPL
      { (* For convergence with CryptoVerif, we allow an identifier (bound on the number of copies) after a replication; it is simply ignored in ProVerif. *)
        PRepl $5, parse_extent() }
  | FOREACH IDENT LEQ IDENT DO tprocess %prec REPL
      { (* For convergence with CryptoVerif, we allow "foreach i<=N do P"
      as a synonym for !P *)
      PRepl $6, parse_extent() }
  | INT
      { let x = $1 in
        if x = 0 then PNil, parse_extent() else
        input_error ("The only integer in a process is 0 for the nil process") (parse_extent()) }
  | YIELD
      { (* For convergence with CryptoVerif, we allow yield instead of 0 *)
        PNil, parse_extent() }
  | NEW IDENT newarg COLON typeid opttprocess
      { PRestr($2, $3, $5, $6), parse_extent() }
  | IDENT RANDOM typeid opttprocess
      { (* For convergence with CryptoVerif, we allow x <-R T
        as a synonym for new x: T *)
        PRestr($1, None, $3, $4), parse_extent() }
  | IF pterm THEN tprocess optelseprocess
      { PTest($2,$4,$5), parse_extent() }
  | IN LPAREN pterm COMMA tpattern RPAREN options opttprocess
      { PInput($3,$5,$8,$7), parse_extent() }
  | OUT LPAREN pterm COMMA pterm RPAREN progend opttprocess
      { POutput($3,$5,$8), parse_extent() }
  | LET tpattern EQUAL pterm
      { PLet($2,$4,(PNil,parse_extent()),(PNil,parse_extent())), parse_extent() }
  | LET tpattern EQUAL pterm IN tprocess optelseprocess
      { PLet($2,$4,$6,$7), parse_extent() }
  | basicpattern LEFTARROW pterm opttprocess
      { (* For convergence with CryptoVerif, we allow x[:T] <- M; P
      as a synonym for let x[:T] = M in P *)
      PLet($1,$3,$4,(PNil,parse_extent())), parse_extent() }
  | LET nevartype SUCHTHAT pterm options
      { PLetFilter($2,$4,(PNil,parse_extent()),(PNil,parse_extent()),$5), parse_extent() }
  | LET nevartype SUCHTHAT pterm options IN tprocess optelseprocess
      { (* Approximating the else clause with a parallel composition
      is not correct for trace reconstruction *)
      PLetFilter($2,$4,$7,$8,$5), parse_extent() }
  | INSERT IDENT LPAREN ptermseq RPAREN opttprocess
      { PInsert($2, $4, $6), parse_extent() }
  | GET IDENT LPAREN tpatternseq RPAREN optsuchthat options optinprocess optelseprocess
      { PGet($2, $4, $6, $8, $9,$7), parse_extent() }
  |	tprocess BAR tprocess
      { PPar($1,$3), parse_extent() }
  | EVENT IDENT LPAREN ptermseq RPAREN newarg opttprocess
      { PEvent($2, $4, $6, $7), parse_extent() }
  | EVENT IDENT newarg opttprocess
      { PEvent($2, [], $3, $4), parse_extent() }
  | PHASE INT opttprocess
      { if ($2) <= 0 then
      input_error "Phases should be positive integers in processes" (parse_extent());
      PPhase($2, $3), parse_extent() }
  | BARRIER INT opttprocess
      { if ($2) <= 0 then
      input_error "Sync numbers should be positive integers" (parse_extent());
      Param.has_barrier := true;
      PBarrier($2, None, $3), parse_extent() }
  | BARRIER INT LBRACKET IDENT RBRACKET opttprocess
      { if ($2) <= 0 then
      input_error "Sync numbers should be positive integers" (parse_extent());
      Param.has_barrier := true;
      PBarrier($2, Some $4, $6), parse_extent() }

opttprocess:
        SEMI tprocess
        { $2 }
|
        { PNil, parse_extent() }

optinprocess:
        IN tprocess
        { $2 }
|
        { PNil, parse_extent() }

optelseprocess:
        ELSE tprocess
        { $2 }
|
        { PNil, parse_extent() }

basicpattern:
  IDENT
    { PPatVar($1,None) }
| IDENT COLON typeid
    { PPatVar($1, Some $3) }
| UNDERSCORE 
    { PPatAny ($1, None) }
| UNDERSCORE COLON typeid
    { PPatAny ($1, Some $3) }

tpattern:
  | basicpattern
      { $1 }
  | LPAREN tpatternseq RPAREN
      { match $2 with
      [t] -> t   (* Allow parentheses for priorities of infix operators;
        Tuples cannot have one element. *)
    | l -> PPatTuple($2) }
  | IDENT LPAREN tpatternseq RPAREN
      { PPatFunApp($1,$3) }
  | CHOICE LBRACKET tpattern COMMA tpattern RBRACKET
      { Param.has_choice := true;
        PPatChoice(("choice", parse_extent()), [$3; $5], None) }
  | CHOICE LBRACKET tpattern COMMA tpattern RBRACKET COLON typeid
      { Param.has_choice := true;
        PPatChoice(("choice", parse_extent()), [$3; $5], Some $8) }
  | INT
      { Param.has_integer := true; unfold_pat_int (pat_zero()) $1 }
  | tpattern PLUS INT
      { Param.has_integer := true; unfold_pat_int $1 $3 }
  | INT PLUS tpattern
      { Param.has_integer := true; unfold_pat_int $3 $1 }
  | EQUAL pterm
      { PPatEqual($2) }

nepatternseq:
  tpattern COMMA nepatternseq
    { $1 :: $3 }
| tpattern
    { [$1] }

tpatternseq:
  nepatternseq
    { $1 }
|
    { [] }

/* Process terms */

pterm:
	IDENT LPAREN ptermseq RPAREN
	{ PPFunApp ($1, $3), parse_extent() }
|       CHOICE LBRACKET pterm COMMA pterm RBRACKET
        { Param.has_choice := true;
	  PPFunApp(("choice", parse_extent()), [$3; $5]), parse_extent() }
|	IDENT
	{ PPIdent ($1), parse_extent() }
|       INT
        { Param.has_integer := true; unfold_pint (pzero ()) $1 }
|       pterm MINUS INT
        { Param.has_integer := true; unfold_pint_minus $1 $3 }
|       pterm PLUS INT
        { Param.has_integer := true; unfold_pint $1 $3 }
|       INT PLUS pterm
        { Param.has_integer := true; unfold_pint $3 $1 }
|       pterm LESS pterm
        { Param.has_integer := true; PPFunApp(("<", parse_extent()), [$1; $3]), parse_extent() }
|       pterm GREATER pterm
        { Param.has_integer := true; PPFunApp((">", parse_extent()), [$1; $3]), parse_extent() }
|       pterm LEQ pterm
        { Param.has_integer := true; PPFunApp(("<=", parse_extent()), [$1; $3]), parse_extent() }
|       pterm GEQ pterm
        { Param.has_integer := true; PPFunApp((">=", parse_extent()), [$1; $3]), parse_extent() }
|       pterm EQUAL pterm
        { PPFunApp(("=", parse_extent()), [$1; $3]), parse_extent() }
|       pterm DIFF pterm
        { PPFunApp(("<>", parse_extent()), [$1; $3]), parse_extent() }
|       NOT LPAREN pterm RPAREN
        { PPFunApp(("not", parse_extent()), [$3]), parse_extent() }
|       pterm OR pterm
        { PPFunApp(("||", parse_extent()), [$1; $3]), parse_extent() }
|       pterm WEDGE pterm
        { PPFunApp(("&&", parse_extent()), [$1; $3]), parse_extent() }
| 	NEW IDENT newarg COLON typeid SEMI pterm
        { PPRestr($2, $3, $5, $7), parse_extent() }
|       IDENT RANDOM typeid SEMI pterm
        { PPRestr($1, None, $3, $5), parse_extent() }
|	IF pterm THEN pterm optelseterm
	{ PPTest($2,$4,$5), parse_extent() }
| 	LET tpattern EQUAL pterm IN pterm optelseterm
	{ PPLet($2,$4,$6,$7), parse_extent() }
|       basicpattern LEFTARROW pterm SEMI pterm
        { PPLet($1,$3,$5,None), parse_extent() }
|       LET nevartype SUCHTHAT pterm IN pterm optelseterm
        { PPLetFilter($2,$4,$6,$7), parse_extent() }
|       EVENT IDENT optargs newarg SEMI pterm
        { PPEvent($2, $3, $4, $6), parse_extent() }
|       INSERT IDENT LPAREN ptermseq RPAREN SEMI pterm
        { PPInsert($2,$4,$7), parse_extent() }
|       GET IDENT LPAREN tpatternseq RPAREN optsuchthat options IN pterm optelseterm
        { PPGet($2,$4,$6,$9,$10,$7), parse_extent() }
|	LPAREN ptermseq RPAREN
	{ match $2 with
	  [t] -> t   (* Allow parentheses for priorities of infix operators;
			Tuples cannot have one element. *)
	| l -> PPTuple (l), parse_extent() }

optelseterm:
    ELSE pterm
    { Some $2 }
|
    { None }

optsuchthat:
    SUCHTHAT pterm
    { Some $2 }
|
    { None }

optargs:
    LPAREN ptermseq RPAREN
    { $2 }
|
    { [] }

neptermseq:
	pterm COMMA neptermseq
	{ $1 :: $3 }
|	pterm
	{ [$1] }

ptermseq:
        neptermseq
        { $1 }
|
        { [] }

/* Permutations, to manually specify swappings */

onepermut:
    TAG RED TAG
    { [$1;$3] }
|   TAG RED onepermut
    { $1 :: $3 }

permut:

    { [] }
|   onepermut
    { [$1] }
|   onepermut SEMI permut
    { $1 :: $3 }


/* Ordering of function symbols, to prove termination of rewrite rules
   coming from equations */

order:
    IDENT GREATER order
    { $1 :: $3 }
  | IDENT
    { [$1] }
