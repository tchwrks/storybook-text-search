function extractStringValues(obj, depth = 0) {
    if (depth > 2) return []; // prevent deep bloat
    const values = [];

    if (Array.isArray(obj)) {
        for (const item of obj) {
            values.push(...extractStringValues(item, depth + 1));
        }
    } else if (typeof obj === 'object' && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
            values.push(key);
            if (typeof value === 'string' || typeof value === 'number') {
                values.push(String(value));
            } else if (typeof value === 'object') {
                values.push(...extractStringValues(value, depth + 1));
            }
        }
    }

    return values;
}

export function apiEndpointExtractor(node) {
    const strings = [];

    const getAttr = (name) => node.attributes?.find(attr => attr.name === name);

    const extractArrayExpression = (valueNode) => {
        if (valueNode?.type !== 'mdxJsxAttributeValueExpression' || typeof valueNode.value !== 'string') return [];
        try {
            return new Function(`return (${valueNode.value})`)();
        } catch (err) {
            console.warn(`⚠️ Failed to parse APIEndpoint array prop '${valueNode?.name}':`, err);
            return [];
        }
    };

    // Basic attributes
    const methodAttr = getAttr('method');
    const pathAttr = getAttr('path');
    const descAttr = getAttr('description');

    if (typeof methodAttr?.value === 'string') strings.push(methodAttr.value);
    if (typeof pathAttr?.value === 'string') strings.push(pathAttr.value);
    if (typeof descAttr?.value === 'string') strings.push(descAttr.value);

    // Parameters
    const params = extractArrayExpression(getAttr('parameters')?.value);
    for (const param of params) {
        if (param?.name) strings.push(param.name);
        if (param?.type) strings.push(param.type);
        if (param?.description) strings.push(param.description);
    }

    // Responses
    const responses = extractArrayExpression(getAttr('responses')?.value);
    for (const res of responses) {
        if (res?.status !== undefined) strings.push(String(res.status));
        if (res?.description) strings.push(res.description);
        if (res?.example) {
            try {
                const exampleObj = JSON.parse(res.example);
                strings.push(...extractStringValues(exampleObj));
            } catch {
                strings.push(res.example); // fallback
            }
        }
    }

    return strings;
}