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
  inputPaths: string | string[]; // support glob
  outputDebugJson: boolean;
  jsxTextMap?: Record<string, ExtractionRule>;
  maxJsxDepth: number;
  jsxPropAllowList: string[];
}

