/**
 * Params for getResultHighlightSnippet
 */
export interface GetHighlightSnippetOptions {
    /**
     * The content to get a snippet from 
     * @string
     */
    content: string;
    /**
     * The query to highlight
     * @string
     */
    query: string;
    /**
     * The radius of the snippet (in characters)
     */
    radius?: number;
    /**
     * The color of the highlighted query
     * @string
     */
    highlightColor?: string;
}

/**
 * Get a snippet of content with the query highlighted
 * @param options - The options for the snippet
 * @param options.content - The content to get a snippet from
 * @param options.query - The query to highlight
 * @param options.radius - The radius of the snippet (in characters)
 * @param options.highlightColor - The color of the highlighted query
 * @returns The snippet with the query highlighted if found, otherwise the content. Returns as HTML.
 */
export function getResultHighlightSnippet({
    content,
    query,
    radius = 50,
    highlightColor = "#ff0"
}: GetHighlightSnippetOptions): string {
    const lcContent = content.toLowerCase();
    const lcQuery = query.toLowerCase();
    const index = lcContent.indexOf(lcQuery);
    if (index === -1) {
        return content.slice(0, 100) + "..."; // fallback: still trim
    }

    const start = Math.max(0, index - radius);
    const end = Math.min(content.length, index + query.length + radius); // include full query

    const snippet = content.slice(start, end);
    const highlighted = snippet.replace(
        new RegExp(`(${query})`, "gi"),
        `<mark style="background-color: ${highlightColor}">$1</mark>`
    );

    return (start > 0 ? "..." : "") + highlighted + (end < content.length ? "..." : "");
}