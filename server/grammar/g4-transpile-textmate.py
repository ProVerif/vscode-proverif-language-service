import json
import re


reserved_regex_characters = '.()[]|\{\}*+?^$/-\\'
reserved_regex_characters_dictionary = {}
for character in reserved_regex_characters:
    reserved_regex_characters_dictionary[character] = '\\' + character
reserved_regex_translator = str.maketrans(reserved_regex_characters_dictionary)


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
                regex = x.group(2).translate(reserved_regex_translator)
                tokens[x.group(1)] = ScopedRegex(regex, x.group(3))

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
    valid_terminals = ['DOT', 'SEMI']

    patterns = []
    for variant in variants:
        if len(variant) == 0:
            continue

        if root_context and variant[len(variant) - 1] == rule:
            variant = variant[:-1]

        begin_entries = []
        begin_captures = {}
        for entry in variant:
            if entry in tokens:
                begin_entries.append('(' + tokens[entry].regex + ')')
                begin_captures[str(len(begin_captures)+1)] = {'name': tokens[entry].scope}
            else:
                break

        terminal_token = None
        ignored_tokens = []
        for entry in reversed(variant):
            if entry in valid_terminals and entry in tokens:
                terminal_token = tokens[entry]
                break
            else:
                ignored_tokens.append(entry)

        if terminal_token and len(begin_entries) > 0:
            if len(ignored_tokens) > 0:
                print('WARNING: No terminal found at the end; ignoring parts of the rule: ' + ' '.join(variant))
            patterns.append({
                'begin': '\s+'.join(begin_entries),
                "beginCaptures": begin_captures,
                'end': '(' + terminal_token.regex + ')',
                "endCaptures": {
                    "1": {"name": terminal_token.scope}
                }
            })
        else:
            print('WARNING: Ignoring rule as no terminal or no expressible tokens found: ' + ' '.join(variant))

    return patterns


def write_to_repository(repository):
    with open('../../syntaxes/pv.tmLanguage.json', 'r') as reader:
        content = reader.read()

    current_json = json.loads(content)
    for key in repository.keys():
        current_json['repository'][key] = {'patterns': repository[key] }
    next_json = json.dumps(current_json)

    with open('../../syntaxes/pv.tmLanguage.json', 'w') as writer:
        writer.write(next_json)


tokens = get_lexer_content()
add_manual_tokens(tokens)

rules = get_parser_content()

textmate_repository = {}
textmate_repository['lib'] = generate_textmate('lib', rules, tokens, True)
print(textmate_repository)
write_to_repository(textmate_repository)
