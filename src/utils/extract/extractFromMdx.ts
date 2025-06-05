import fs from 'fs/promises';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { extractFromJsx } from './extractFromJsx';
import { normalizeRule } from '../normalizeRule';
import { TextSearchConfig } from 'src/types';

export interface ExtractedMdxData {
    text: string[];
    metaTitle: string | undefined;
}

interface ExtractTextFromMdxOptions {
    filePath: string;
    jsxTextMap?: TextSearchConfig['jsxTextMap'];
    maxJsxDepth: TextSearchConfig['maxJsxDepth'];
    jsxPropAllowList: TextSearchConfig['jsxPropAllowList'];
}


export async function extractTextFromMdx({ filePath, jsxTextMap, maxJsxDepth, jsxPropAllowList }: ExtractTextFromMdxOptions): Promise<ExtractedMdxData> {
    const fileContent = await fs.readFile(filePath, 'utf-8');

    const extractedTree = unified()
        .use(remarkParse)
        .use(remarkMdx)
        .parse(fileContent);
    const textNodes: string[] = [];
    let metaTitle: string | undefined = undefined;

    visit(extractedTree, (node) => {
        if (node.type === 'text') {
            textNodes.push(node.value);
        }

        if (
            (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
            typeof node.name === 'string'
        ) {
            if (node.name === "Meta" && Array.isArray(node.attributes)) {
                const titleAttr = node.attributes.find(
                    (attr) => attr.type === "mdxJsxAttribute" && attr.name === "title"
                );

                if (titleAttr && typeof titleAttr.value === "string") {
                    metaTitle = titleAttr.value;
                }
            }
            const rule = jsxTextMap?.[node.name];
            const maxDepth = maxJsxDepth ?? 5; // Should default to 5 anyway. This is just a fallback
            if (rule) {
                const normalizedRule = normalizeRule(rule);
                const jsxTexts = extractFromJsx({ node, rule: normalizedRule, depth: 0, maxJsxDepth: maxDepth, jsxTextMap, jsxPropAllowList });
                textNodes.push(...jsxTexts);
            } else {
                // Fallback: recursively extract from children and allowed props
                const fallbackRule = normalizeRule({
                    props: jsxPropAllowList ?? [],
                    children: true,
                    nestedTextSelectors: [],
                });
                const jsxTexts = extractFromJsx({ node, rule: fallbackRule, depth: 0, maxJsxDepth: maxDepth, jsxTextMap, jsxPropAllowList });
                textNodes.push(...jsxTexts);
            }
        }
    });
    const cleaned = [...new Set(
        textNodes
            .map(str => str.replace(/\s+/g, ' ').trim()) // collapse newlines/tabs
            .filter(Boolean) // remove empty strings
    )];

    return {
        text: cleaned,
        metaTitle,
    };
}