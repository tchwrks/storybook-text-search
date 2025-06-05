export function tableExtractor(node) {
    const strings = [];

    const columnsAttr = node.attributes?.find(attr => attr.name === 'columns');
    const dataAttr = node.attributes?.find(attr => attr.name === 'data');

    const extractFromArrayExpression = (valueNode) => {
        if (valueNode?.type !== 'mdxJsxAttributeValueExpression' || typeof valueNode.value !== 'string') return [];

        try {
            const evalFunc = new Function(`return (${valueNode.value})`);
            const parsed = evalFunc();

            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (err) {
            console.warn('⚠️ Failed to parse Table attribute value:', err);
        }

        return [];
    };

    const columns = extractFromArrayExpression(columnsAttr?.value);
    const data = extractFromArrayExpression(dataAttr?.value);

    for (const col of columns) {
        if (typeof col?.header === 'string') {
            strings.push(col.header);
        }
    }

    for (const row of data) {
        for (const key in row) {
            if (typeof row[key] === 'string') {
                strings.push(row[key]);
            }
        }
    }

    return strings;
}