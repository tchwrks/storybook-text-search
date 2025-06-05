<!-- README START -->

# @tchwrks/storybook-text-search

A Storybook addon that enables full-text search through your component and documentation content.

- 🔍 Builds an MDX/code/documentation index at startup
- 💡 Integrates a search bar into the Storybook manager UI as a toolbar
- ♻️ Automatically rebuilds index on hot reload
- ⚙️ Works with both Vite and Webpack Storybook builders
- ✍️ Written in TypeScript using the official [Addon Kit](https://github.com/storybookjs/addon-kit)

## Getting Started

### Installation
First, install the addon:

```bash
yarn add -D @tchwrks/storybook-text-search
# or
npm install --save-dev @tchwrks/storybook-text-search
```

Then add it to your `.storybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/react-vite'; // or react-webpack5

const config: StorybookConfig = {
  addons: ['@tchwrks/storybook-addon-text-search'],
  // OR with options (coming soon):
  // addons: [
  //   {
  //     name: '@tchwrks/storybook-addon-text-search',
  //     options: {
  //       configPath: './textsearch.config.ts',
  //     },
  //   },
  // ],
};

export default config;
```


### Configuration (`textsearch.config.ts`)
*Note to self: Turn this into a textsearch.config.js before release*

```ts
// Place this in the root of your project (same level as your package.json, tsconfig.json, vite.config.ts, etc)
import { type SearchIndexConfig } from '@tchwrks/storybook-addon-text-search';

const config: SearchIndexConfig = {
  include: ['src/**/*.stories.tsx', 'src/**/*.mdx'],
  extractors: [
    {
      pattern: /\.mdx$/,
      extract: async (file) => {
        const content = await fs.promises.readFile(file, 'utf8');
        return { id: file, title: extractTitle(content), content };
      },
    },
    // Add more extractors as needed
  ],
};

export default config;
```

> Customize this as needed to index the right files and extract meaningful metadata for your docs/components.

## Usage
*Note to self: Update this before release*

## Development Scripts

- `yarn start` – Runs the addon and test Storybook in dev mode
- `yarn build` – Builds the addon for publishing
- `yarn build:watch` – Rebuilds the addon on file changes

## What's Included

This addon uses the standard Storybook Addon Kit setup. Highlights:

- `src/preset.ts` runs the index builder during `viteFinal` or `webpackFinal`
- `src/manager.tsx` registers the UI element
- `src/preview.ts` adds decorators (if needed in the future)
- `src/textsearch/` contains all indexing logic

## Releasing

This repo is set up with [`auto`](https://github.com/intuit/auto) for release automation.

To create a release:

```bash
yarn release
```

Make sure you set `GH_TOKEN` and `NPM_TOKEN` in your environment before releasing.

## License

MIT

--
<br/>
<br/>
Made with love by [Noah Davis](https://noahidavis.com) of [techworks.studio](https://techworks.studio)

<!-- README END -->