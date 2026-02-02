import type { StorybookConfig } from "@storybook/react-vite";
const config: StorybookConfig = {
  stories: ["../src/stories/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: [
      "@storybook/addon-docs",
        "@storybook/addon-links",
        "@tchwrks/storybook-text-search"
    ],
    staticDirs: ['../src/stories/assets', "../.storybook-text-search/artifacts"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    builder: '@storybook/builder-vite',
  },
  async viteFinal(config) {
    return {
      ...config,
      optimizeDeps: {
        ...config.optimizeDeps,
        exclude: ['node_modules/.cache/storybook'],
        include: [...(config.optimizeDeps?.include || [])],
      },
    };
  },
};
export default config;
