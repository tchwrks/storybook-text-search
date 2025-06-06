<!-- README START -->
<p align="center">
  <img src=".github/assets/brandmark-addon-name-banner-white-on-transp.png" alt="Storybook Text Search banner" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/@tchwrks/storybook-text-search" />
  <img src="https://img.shields.io/npm/l/@tchwrks/storybook-text-search" />
  <img src="https://img.shields.io/bundlephobia/minzip/@tchwrks/storybook-text-search" />
</p>

***
<br/>

`@tchwrks/storybook-text-search` is a Storybook addon that enables full-text search across MDX content:

- 🔍 Builds an MDX/documentation index at startup (Stories / autodocs parsing on the roadmap)
- 💡 Integrates a "search bar" toolbar trigger and modern search modal into the Storybook manager UI
- ♻️ Automatically rebuilds index on hot reload
- 🎹 100% keyboard accessible
- ⚙️ Works with both Vite and Webpack Storybook builders
- ✍️ Written in *(mostly)* TypeScript using the official [Addon Kit](https://github.com/storybookjs/addon-kit)
- 🐭 Sub 200KB index for >20 MDX files
- 🏎️ Fast local search. No server needed. No 3-5 business days for results

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
    - ["Trust the process"](#trust-the-process)
    - ["I'll do it myself"](#ill-do-it-myself)
- [Advanced Configuration](#advanced-configuration)
  - [Full `config.mjs` Options](#full-configmjs-options)
    - [Extraction Rule Type](#extraction-rule-type)
  - [Utilizing `config.jsxTextMap`](#utilizing-configjsxtextmap)
- [About](#about)
    - [Built by Techworks Studio](#built-by-techworks-studio)
    - [Other goodies from techworks](#other-goodies-from-techworks)
    - [Connect](#connect)
- [License](#license)
- [Roadmap](#roadmap)

## Getting Started

### Installation
First, install the addon:

```bash
yarn add -D @tchwrks/storybook-text-search
# or
npm install --save-dev @tchwrks/storybook-text-search

# Optionally, to install and register the addon in .storybook/main#addons
yarn dlx storybook add @tchwrks/storybook-text-search
# or
npx storybook add @tchwrks/storybook-text-search
```


### Configuration

#### "Trust the process"
This addon ships with an initialization script to get you going:

```bash
npx storybook-text-search-init
```
This script will:
- Generate `.storybook-text-search` which houses the config and artifact(s)
- Read your `.storybook/main.{ts,js}` and generate a default `.storybook-text-search/config.js` with sensible defaults
- Register the addon and its artifacts in `.storybook/main.{ts,js}` 
- Generate an initial index. 

For most setups, this is all you need to get going. Just start Storybook like usual and enjoy!

#### "I'll do it myself"

<details>
<br/>
<summary>Fine. Since you want to be a grown-up, complete the following:</summary>

1. Create the tool / addon directory, `.storybook-text-search/` at your project's root (or at the same level as your `.storybook/` 
   
2. Create a `.storybook-text-search/config.mjs`:
    ```javascript
    // Custom extractors. See `advanced configuration` for more

    import {
      tableExtractor,
      colorPaletteExtractor,
      apiEndpointExtractor,
      typeScaleExtractor
    } from "./custom-extractors/index.js";

    const config = {
      // inputPaths ≈ stories from .storybook/main.{ts,js}. Glob ext should be written like example
      // ...for single dir, still place inside an array
      inputPaths: ["../src/stories/**/*.mdx", "../src/**/*.stories.{js,jsx,ts,tsx}"],
      // Recursion level/component depth for jsx parsing
      maxJsxDepth: 5,
      // Props to parse for fallback jsx parse (opt for jsxTextMap entry when possible)
      jsxPropAllowList: ['alt', 'title', 'aria-label', 'placeholder', 'label', 'value', 'children'],
    };

    export default config;
    ```  
    > Customize this as needed to index the right files and extract meaningful metadata for your docs. See [advanced configuration](#advanced-configuration) for more
    
3. Create `.storybook-text-search/artifacts` directory
   
4. Regardless of whether you used `storybook add` for install, make sure you register the addon + artifacts dir from the previous step in your `.storybook/main.{ts,js}`:
    ```typescript
    // .storybook/main.ts (React + Vite)

    import type { StorybookConfig } from "@storybook/react-vite";
    const config: StorybookConfig = {
      stories: ["../src/stories/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
      addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        // Register addon. Order determines toolbar placement (last = right)
        // ...running `storybook add` automatically registers addon
        "@tchwrks/storybook-text-search"
      ],
      // Register artifacts dir. Order does not matter
      staticDirs: ['../.storybook-text-search/artifacts', '../src/assets'],
      framework: {
        name: "@storybook/react-vite",
        options: {},
      },
      docs: {
        autodocs: "tag",
      },
      core: {
        builder: '@storybook/builder-vite',
      }
    };
    
    export default config;
   ```

5. Finally, run `npx storybook-text-search-build` or start your Storybook (index will build during startup)
</details>

## Usage

Usage of this addon is pretty straightforward once you set it up. Just add `*.mdx` docs into the paths you defined in your `.storybook-text-search/config.mjs` and they'll be automatically indexed on Storybook startup and hot reload.

When Storybook is running, you can open the search modal by clicking the trigger in the toolbar labeled **"Find MDX Text"** or by using the keyboard shortcut `Shift + Cmd + K`. Once open, you can use your mouse/trackpad or the following keyboard shortcuts to navigate:

| Shortcut           | Action                   |
| ------------------ | ------------------------ |
| `Shift + Cmd + K`  | Open search modal        |
| `↑` / `↓` or `Tab` | Navigate between results |
| `Enter`            | Jump to selected result  |
| `Esc`              | Close the search modal   |

You can adjust the positioning of the search modal trigger / search bar by adjusting where you place `@tchwrks/storybook-text-search` in your `.storybook/main` addon array. Beginning of array = leftmost toolbar spot, end of array = rightmost toolbar spot.

While the addon can pick up on raw markdown and parse basic text rendered in JSX as children or props by leveraging just the `maxJsxDepth` and `jsxPropsAllowList` fields in the `config.mjs`, you may find that it does not fully parse or normalize the text. In which case, please consider leveraging the `jsxTextMap` field in the `config.mjs`. It allows you to map out extraction behavior for JSX on a per-component basis. See [Advanced Configuration](#advanced-configuration) for further documentation on this.

If for whatever reason you would like to re-run the initialization script or manually trigger an index rebuild, you can run either of the following scripts:

```bash
npx storybook-text-search-init  # addon initialization

npx storybook-text-search-build  # build index
```
>*A hosted Storybook with expanded documentation and a live demo will be released soon*

## Advanced Configuration

As mentioned in the [Usage](#usage) section, this addon does a pretty decent job of parsing text for *most* basic `*.mdx` files. However, MDX files can contain JSX, and that JSX might render text at any arbitrary depth and through non-string props. That's where the `jsxTextMap` field in the `.storybook-text-search/config.mjs` comes into play.


This is where things get lengthy. You've been warned . . .

### Full `config.mjs` Options

| Field | Type | Description |
| ----  | ---- | ---- |
| `inputPaths` | `string[]` | MDX and story globs. Use `.{.foo, .bar}` for glob extensions |
| `maxJsxDepth` | `number` | Recursion depth for parsing JSX |
| `jsxPropsAllowList` | `string[]` | JSX props to extract using default extraction logic |
| `jsxTextMap` | `Record<string, ExtractionRule>` | Per-component mapping

#### Extraction Rule Type
```typescript
export type ExtractionRule =
  | string[] // prop name shorthand
  | {
    props?: string[]; // prop name shorthand
    children?: boolean; // has children
    nestedTextSelectors?: string[]; // Nested component / element names
  }
  | ((node: any) => string[]); // custom extraction function

```
<br/>

<details>
<summary>Click to view <code>jsxTextMap</code> examples and advanced use cases</summary>

### Utilizing `config.jsxTextMap`

A configuration file utilizing custom extraction logic might look like the following

```javascript
// .storybook-text-search/config.mjs
import {
  tableExtractor,
} from './custom-extractors/index.js';

const config = {
  // inputPaths ≈ stories from .storybook/main.{ts,js}. Glob ext should be written like example
  // ...for single dir, still place inside an array
  inputPaths: ['../src/stories/**/*.mdx', '../src/**/*.stories.{js,jsx,ts,tsx}'],
  // Recursion level/component depth for jsx parsing
  maxJsxDepth: 5,
  // Props to parse for fallback jsx parse (opt for jsxTextMap entry when possible)
  jsxPropAllowList: ['alt', 'title', 'aria-label', 'placeholder', 'label', 'value', 'children'],
  // Custom / more explicit parsing
  jsxTextMap: {
    // Shorthand (similar to jsxPropAllowList, just scoped)
    Badge: ['callout'],
    // Example: <TextBlock>Text here</TextBlock>
    TextBlock: ['children'],
    // Useful for if you have a complex nesting of plain string props
    // Example: <Callout message="..." >Text</Callout>
    Callout: {
      props: ['message'],
        children: true,
        nestedTextSelectors: ['BodyText'],
    },
    // For when sh*t gets hairy
    Table: {
      extractor: tableExtractor // (node) => string[]
    },
};

export default config;
```

When defining `ExtractionRule` functions (Table from the code above), it is recommended you write them as plain `*.js` files. ESM vs CJS shouldn't make a difference--but likely won't need extra deps anyway. 

Given a `Table` component that looks like the following:

```typescript
import React from "react";

type Column<T> = {
    key: keyof T;
    header: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type Props<T> = {
    columns: Column<T>[];
    data: T[];
    className?: string;
};

export function Table<T extends Record<string, any>>({ columns, data, className }: Props<T>) {
    return (
        <table className={className} style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr>
                    {columns.map((col, i) => (
                        <th
                            key={i}
                            style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: "8px" }}
                        >
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((col, colIndex) => (
                            <td
                                key={colIndex}
                                style={{ borderBottom: "1px solid #f0f0f0", padding: "8px" }}
                            >
                                {col.render ? col.render(row[col.key], row) : row[col.key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
```

A custom `ExtractionRule` function for that component might look like this:

```javascript
// .storybook-text-search/custom-extractors (or wherever you want to put it--knock yourself out)

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
```
</details>
  
<br/>

***Want to get back to where you were before? I got you***
- [Basic configuration setup](#ill-do-it-myself) 
- [Addon usage](#usage)

## About
####  Built by Techworks Studio
[Techworks Studio](https://techworks.studio) is a hybrid consultancy and R&D studio crafting tools and solutions that empower bold ideas, streamline workflows, and elevate user experiences

#### Other goodies from techworks

- [tokenXtractor](https://www.figma.com/community/plugin/1401554311953331143/tokenxtractor-by-techworks-studio) - Free Figma plugin for extracting local variables (tokens) into a more code-ready format. Control which collections get exported and how
- [Figma Plugin React]([https://](https://github.com/noahidavis/figma-plugin-react-2024)) - TS template for creating Figma plugins with a React template

#### Connect
This addon is built maintained by [Noah Davis](https://noahidavis.com) at Techworks Studio

- [Personal Portfolio](https://noahidavis.com)
- [LinkedIn](https://linkedin.com/in/noahidavis)
- [X/Twitter](https://x.com/noahidavis)

Have feedback, ideas, or a collaboration in mind? Reach out anytime

## License

[MIT](LICENSE)

## Roadmap
- [ ] Demo-embedded docs
- [ ] React: Parse stories + component definitions (for autodocs)
- [ ] Advanced searches (multi-keyword, boolean operations, etc)
- [ ] Expanded config

<br/>
<br/>

<!-- README END -->