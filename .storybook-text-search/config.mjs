import {
  tableExtractor,
  colorPaletteExtractor,
  apiEndpointExtractor,
  typeScaleExtractor
} from "./custom-extractors/index.js";

const config = {
  inputPaths: ["../src/stories/**/*.mdx", "../src/**/*.stories.{js,jsx,ts,tsx}"],
  pathPrefix: undefined,
  jsxPropAllowList: ['alt', 'title', 'aria-label', 'placeholder', 'label', 'value', 'children'],
  jsxTextMap: {
    Table: {
      extractor: tableExtractor
    },
    ColorPalette: {
      extractor: colorPaletteExtractor
    },
    APIEndpoint: {
      extractor: apiEndpointExtractor
    },
    TypeScale: {
      extractor: typeScaleExtractor
    }
  }
};

export default config;
