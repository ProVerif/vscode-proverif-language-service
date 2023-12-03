import json
import re


class ScopedRegex:
    def __init__(self, regex, scope):
        self.regex = regex
        self.scope = scope

    def __repr__(self):
        return self.regex + " / " + self.scope


def get_lexer_content():
    tokens = {}
    with open('ProverifLexer.g4', 'r') as reader:
        content = reader.read()

        lines = content.splitlines()
        for line in lines:
            x = re.search("^([A-Z]+):\s*'(.+)';.*scope ([a-z.]+)", line)
            if x:
                tokens[x.group(1)] = ScopedRegex(x.group(2), x.group(3))

    return tokens


def get_parser_content():
    rules = {}
    with open('ProverifParser.g4', 'r') as reader:
        content = reader.read()

        lines = content.splitlines()
        rule_content = "\n".join(lines[4:])
        words = rule_content.split()
        rule = None
        variant = []
        variants = []
        in_comment = False
        for word in words:
            if in_comment:
                if word.endswith('*/'):
                    in_comment = False
            elif not rule:
                rule = word
            elif word == ':':
                pass
            elif word.startswith('/*'):
                if not word.endswith('*/'):
                    in_comment = True
            elif word == '|':
                variants.append(variant)
                variant = []
            elif word == ';':
                variants.append(variant)
                variant = []

                rules[rule] = variants
                variants = []
                rule = None
            else:
                variant.append(word)

    return rules


def add_manual_tokens(tokens):
    tokens['STRING'] = ScopedRegex('"*?"', 'string.quoted.double.pv')
    tokens['INT'] = ScopedRegex('[0-9]+', 'constant.numeric.decimal.pv')
    tokens['FLOAT'] = ScopedRegex(
        '([0-9]+\\.[0-9]+)|([0-9]+(\\.[0-9]*)?(e|E)(\\+|-)?[0-9]+)',
        'constant.numeric.float.pv'
    )
    tokens['IDENT'] = ScopedRegex(
        '[a-zA-Z][a-zA-Z0-9\'_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u00FF]*',
        'entity.name.pv'
    )
    tokens['PROJECTION'] = ScopedRegex(
        '[0-9]-proj-([a-zA-Z][a-zA-Z0-9\'_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u00FF]*)+',
        'entity.name.projection.pv'
    )

def generate_textmate(rule, rules, tokens, root_context):
    variants = rules[rule]
    valid_terminals = ['.', ';']

    patterns = []
    for variant in variants:
        if len(variant) == 0:
            continue

        match_groups = []
        match_groups_scope = []
        last_terminal_at = 0
        if root_context and variant[len(variant)-1] == rule:
            variant = variant[:-1]
        for entry in variant:
            if entry in tokens:
                match_groups.append('('+tokens[entry].regex+')')
                match_groups_scope.append(tokens[entry].scope)

                if tokens[entry].regex in valid_terminals:
                    last_terminal_at = len(match_groups) - 1
            else:
                match_groups.append('.?')
        
        if last_terminal_at < len(match_groups) - 1:
            print('WARNING: Variant does not end with a terminal. Discarding ' + " ".join(variant[last_terminal_at+1:]))

        if last_terminal_at > 0:
            begin_captures = {}
            for index, match_group_scope in enumerate(match_groups_scope[:-1], start=1):
                begin_captures[str(index)] = {'name': match_group_scope}

            patterns.append({
                'begin': '\s'.join(match_groups[:last_terminal_at]),
                'end': match_groups[last_terminal_at],
                "beginCaptures": begin_captures,
                "endCaptures": {
                    "1": {"name": match_groups_scope[len(match_groups_scope)-1]}
                }
            })
        else:
            print('WARNING: Variant has no terminal. Discarding ' + " ".join(variant))

    return patterns


def write_to_repository(repository):

    with open('../../syntaxes/pv.tmLanguage.json', 'rw') as file:
        content = file.read()
        current_json = json.loads(content)

        for rule in repository:
            current_json['repository'][rule] = repository[rule]

        next_json = json.dumps(current_json)
        file.write(next_json)

tokens = get_lexer_content()
print(tokens)
add_manual_tokens(tokens)
print(tokens)

rules = get_parser_content()
print(rules)

textmate_repository = {}
textmate_repository['lib'] = generate_textmate('lib', rules, tokens, True)
write_to_repository(textmate_repository)
