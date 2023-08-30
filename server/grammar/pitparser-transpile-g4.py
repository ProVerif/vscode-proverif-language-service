with open('pitparser.mly', 'r') as reader:
    content = reader.read()

    body = content[content.find("%%") + 2:]  # cut off header
    lines = body.splitlines()

    rules = {}
    ruleName = None
    ruleContent = []
    inComment = False
    for index, line in enumerate(lines):
        normalizedLine: str = line.strip()
        if inComment or normalizedLine.startswith("/*"):
            inComment = True
            if normalizedLine.endswith("*/"):
                inComment = False
            continue

        if normalizedLine.endswith(":"):
            if ruleName:
                rules[ruleName] = ruleContent
            ruleStarts = True
            ruleName = normalizedLine
            ruleContent = []
        elif ruleName and len(ruleContent) == 0 and not normalizedLine.startswith("/*") and not normalizedLine.startswith("//"):
            ruleContent.append(normalizedLine)
        elif ruleName and normalizedLine.startswith('|'):
            ruleContent.append(normalizedLine)
        else:
            print("Ignoring line " + str(index+1) + ": " + normalizedLine)

    resultLines = []
    for rule in rules.keys():
        resultLines.append(rule.strip(":"))
        for index, entry in enumerate(rules[rule]):
            normalizedEntry = entry.strip("|").strip()
            if normalizedEntry == "":
                continue
            if index == 0:
                resultLines.append("    : " + normalizedEntry)
            else:
                resultLines.append("    | " + normalizedEntry)

        resultLines.append("    ;")
        resultLines.append("")

    with open('pitparser.mly_transpiled.g4', 'w') as writer:
        writer.writelines(line + '\n' for line in resultLines)
