export function colorPaletteExtractor(node) {
    const strings = [];

    const groupNameAttr = node.attributes?.find(attr => attr.name === 'groupName');
    const colorsAttr = node.attributes?.find(attr => attr.name === 'colors');

    const extractFromArrayExpression = (valueNode) => {
        if (valueNode?.type !== 'mdxJsxAttributeValueExpression' || typeof valueNode.value !== 'string') return [];

        try {
            const evalFunc = new Function(`return (${valueNode.value})`);
            const parsed = evalFunc();

            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (err) {
            console.warn('⚠️ Failed to parse ColorPalette colors prop:', err);
        }

        return [];
    };

    if (typeof groupNameAttr?.value === 'string') {
        strings.push(groupNameAttr.value);
    }

    const colors = extractFromArrayExpression(colorsAttr?.value);
    for (const color of colors) {
        if (typeof color?.name === 'string') strings.push(color.name);
        if (typeof color?.value === 'string') strings.push(color.value);
        if (typeof color?.description === 'string') strings.push(color.description);
    }

    return strings;
}