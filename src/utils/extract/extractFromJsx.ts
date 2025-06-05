import { normalizeRule, type NormalizedExtractionRule } from '../normalizeRule';
import { TextSearchConfig } from 'src/types';

const HTML_ELEMENTS = new Set([
    'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button',
    'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt',
    'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html',
    'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'meta', 'meter', 'nav', 'noscript',
    'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script',
    'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea',
    'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'
]);

function isHtmlElement(tag: string) {
    return HTML_ELEMENTS.has(tag);
}

function extractStringsFromObject(obj: any): string[] {
    let results: string[] = [];
    if (typeof obj === 'string') {
        results.push(obj);
    } else if (Array.isArray(obj)) {
        for (const item of obj) {
            results.push(...extractStringsFromObject(item));
        }
    } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                results.push(...extractStringsFromObject(obj[key]));
            }
        }
    }
    return results;
}

interface ExtractFromJsxOptions {
    node: any;
    rule: NormalizedExtractionRule;
    depth: number;
    jsxTextMap?: TextSearchConfig['jsxTextMap'];
    maxJsxDepth: TextSearchConfig['maxJsxDepth'];
    jsxPropAllowList: TextSearchConfig['jsxPropAllowList'];
}


export function extractFromJsx(
    { node, rule, depth, maxJsxDepth, jsxTextMap, jsxPropAllowList }: ExtractFromJsxOptions
): string[] {
    if (depth > maxJsxDepth) return [];
    const results: string[] = [];

    // Handle custom extractor
    if (rule.extractor) {
        return rule.extractor(node);
    }

    // Extract from props
    for (const propName of rule.props) {
        const attr = node.attributes?.find((a: any) => a.name === propName);
        if (attr?.type === 'mdxJsxAttribute') {
            if (typeof attr.value === 'string') {
                results.push(attr.value);
            } else if (attr.value && typeof attr.value === 'object' && attr.value.type && (attr.value.type === 'mdxJsxFlowElement' || attr.value.type === 'mdxJsxTextElement')) {
                // Recursively extract from JSX prop value
                const childRule = jsxTextMap?.[attr.value.name] ? normalizeRule(jsxTextMap[attr.value.name]) : { props: [], children: true, nestedTextSelectors: [] };
                results.push(...extractFromJsx({ node: attr.value, rule: childRule, depth: depth + 1, maxJsxDepth, jsxTextMap, jsxPropAllowList }));
            } else if (attr.value && typeof attr.value === 'object') {
                // Recursively extract all strings from object/array props
                results.push(...extractStringsFromObject(attr.value));
            }
        }
    }

    // Extract from children (optionally filtered by nestedTextSelectors)
    if (rule.children && Array.isArray(node.children)) {
        for (const child of node.children) {
            if (child.type === 'text') {
                results.push(child.value);
            } else if ((child.type === 'mdxJsxFlowElement' || child.type === 'mdxJsxTextElement') && typeof child.name === 'string') {
                // Recursively extract from child JSX elements
                const childRule = jsxTextMap?.[child.name]
                    ? normalizeRule(jsxTextMap[child.name])
                    : isHtmlElement(child.name)
                        ? { props: jsxPropAllowList ?? [], children: true, nestedTextSelectors: [] }
                        : { props: [], children: true, nestedTextSelectors: [] };
                results.push(...extractFromJsx({ node: child, rule: childRule, depth: depth + 1, maxJsxDepth, jsxTextMap, jsxPropAllowList }));
            }
        }
    }

    // For HTML elements, extract allowed props
    if (isHtmlElement(node.name) && Array.isArray(node.attributes)) {
        for (const propName of jsxPropAllowList ?? []) {
            const attr = node.attributes.find((a: any) => a.name === propName);
            if (attr?.type === 'mdxJsxAttribute' && typeof attr.value === 'string') {
                results.push(attr.value);
            }
        }
    }

    return results;
}