export function typeScaleExtractor(node) {
    const strings = [];

    const getAttr = (name) =>
        node.attributes?.find((attr) => attr.name === name);

    const extractTokens = (valueNode) => {
        if (
            valueNode?.type !== "mdxJsxAttributeValueExpression" ||
            typeof valueNode.value !== "string"
        )
            return [];
        try {
            return new Function(`return (${valueNode.value})`)();
        } catch (err) {
            console.warn("⚠️ Failed to parse tokens in TypeScale:", err);
            return [];
        }
    };

    const tokens = extractTokens(getAttr("tokens")?.value);
    for (const token of tokens) {
        if (token?.name) strings.push(token.name);
        if (token?.size) strings.push(token.size);
        if (token?.lineHeight) strings.push(token.lineHeight);
        if (token?.weight) strings.push(`Weight: ${token.weight}`);
        if (token?.sampleText) strings.push(token.sampleText);
    }

    return strings;
}