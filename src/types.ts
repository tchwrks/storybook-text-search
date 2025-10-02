// ! not used
export interface Result {
  divs: DOMRect[];
  styled: DOMRect[];
}


// storybook-text-search
export type ExtractionRule =
  | string[] // shorthand
  | {
    props?: string[];
    children?: boolean;
    nestedTextSelectors?: string[];
  }
  | ((node: any) => string[]);

export interface TextSearchConfig {
  /** slug to prefix all paths with during indexing. Essential for deployments to subdomains (e.g. github pages where paths are prefixes with the repo name) */
  pathPrefix?: string;
  /** paths containing mdx docs. Glob paths supported */
  inputPaths: string[];
  /** Explicit declaration of props + children to traverse / custom extraction rule */
  jsxTextMap?: Record<string, ExtractionRule>;
  /** Maximum recursive depth check for text */
  maxJsxDepth: number;
  /** Default allowed / checked props. Must be set */
  jsxPropAllowList: string[];
}

