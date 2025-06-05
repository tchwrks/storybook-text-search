export interface NormalizedExtractionRule {
    props: string[];
    children: boolean;
    nestedTextSelectors: string[];
    extractor?: (node: any) => string[];
}

export function normalizeRule(rule: any): NormalizedExtractionRule {
    if (typeof rule === 'function') {
        return { props: [], children: false, nestedTextSelectors: [], extractor: rule };
    }

    if (Array.isArray(rule)) {
        return {
            props: rule.filter((p) => p !== 'children'),
            children: rule.includes('children'),
            nestedTextSelectors: [],
            extractor: undefined,
        };
    }

    return {
        props: rule.props ?? [],
        children: rule.children ?? false,
        nestedTextSelectors: rule.nestedTextSelectors ?? [],
        extractor: rule.extractor ?? undefined, // 🧠 FIX IS HERE
    };
}