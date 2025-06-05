// * Note: Preview is not used in this addon

import { defineConfig, type Options } from "tsup";
import { readFile } from "node:fs/promises";
import { globalPackages as globalManagerPackages } from "storybook/internal/manager/globals";
// import { globalPackages as globalPreviewPackages } from "storybook/internal/preview/globals"; // Not using this

// The current browsers supported by Storybook v7
const BROWSER_TARGET: Options["target"] = [
  "chrome100",
  "safari15",
  "firefox91",
];
const NODE_TARGET: Options["target"] = ["node18"];

type BundlerConfig = {
  bundler?: {
    exportEntries?: string[];
    nodeEntries?: string[];
    managerEntries?: string[];
    // previewEntries?: string[]; // Not using this
  };
};

export default defineConfig(async (options) => {
  // reading the three types of entries from package.json, which has the following structure:
  // {
  //  ...
  //   "bundler": {
  //     "exportEntries": ["./src/index.ts"],
  //     "managerEntries": ["./src/manager.ts"],
  //     "previewEntries": ["./src/preview.ts"]
  //     "nodeEntries": ["./src/preset.ts"]
  //   }
  // }
  const packageJson = (await readFile("./package.json", "utf8").then(
    JSON.parse,
  )) as BundlerConfig;
  const {
    bundler: {
      exportEntries = [],
      managerEntries = [],
      nodeEntries = [],
    } = {},
  } = packageJson;

  const commonConfig: Options = {
    splitting: false,
    minify: !options.watch,
    treeshake: true,
    sourcemap: true,
    clean: options.watch ? false : true,
    outDir: "dist",
    external: ["flexsearch"]
  };

  const configs: Options[] = [];

  // export entries are entries meant to be manually imported by the user
  // they are not meant to be loaded by the manager or preview
  // they'll be usable in both node and browser environments, depending on which features and modules they depend on
  if (exportEntries.length) {
    configs.push({
      ...commonConfig,
      entry: exportEntries,
      dts: {
        resolve: true,
      },
      format: ["esm", "cjs"],
      // format: ["esm"],
      target: [...BROWSER_TARGET, ...NODE_TARGET],
      platform: "neutral",
      external: [...globalManagerPackages],
    });
  }

  // manager entries are entries meant to be loaded into the manager UI
  // they'll have manager-specific packages externalized and they won't be usable in node
  // they won't have types generated for them as they're usually loaded automatically by Storybook
  if (managerEntries.length) {
    configs.push({
      ...commonConfig,
      entry: managerEntries,
      format: ["esm"],
      target: BROWSER_TARGET,
      platform: "browser",
      external: globalManagerPackages,
    });
  }


  // node entries are entries meant to be used in node-only
  // this is useful for presets, which are loaded by Storybook when setting up configurations
  // they won't have types generated for them as they're usually loaded automatically by Storybook
  const cliEntries = nodeEntries.filter((e) => e.includes("bin"));
  const presetEntries = nodeEntries.filter((e) => e.includes("preset"));
  // const scriptEntries = nodeEntries.filter((e) => e.includes("script"));
  // const utilsEntries = nodeEntries.filter((e) => e.includes("utils"));
  // const jsEntries = nodeEntries.filter((e) => e.includes("pure-js"));
  const otherEntries = nodeEntries.filter((e) => !e.includes("bin") && !e.includes("preset"));

  if (cliEntries.length) {
    configs.push({
      ...commonConfig,
      entry: cliEntries,
      shims: true,
      format: ["esm"],
      target: NODE_TARGET,
      outDir: "dist/bin",
      platform: "node",
      banner: {
        js: "#!/usr/bin/env node",
      },
    });
  }

  if (presetEntries.length) {
    configs.push({
      ...commonConfig,
      entry: presetEntries,
      format: ["cjs"],
      // format: ["esm"],
      target: NODE_TARGET,
      platform: "node",
    });
  }

  // if (scriptEntries.length) {
  //   configs.push({
  //     ...commonConfig,
  //     entry: scriptEntries,
  //     shims: true,
  //     format: ["esm"],
  //     target: NODE_TARGET,
  //     platform: "node",
  //     outDir: "dist/scripts"
  //   });
  // }

  // if (utilsEntries.length) {
  //   configs.push({
  //     ...commonConfig,
  //     entry: utilsEntries,
  //     format: ["esm"],
  //     target: NODE_TARGET,
  //     platform: "node",
  //     outDir: "dist/utils"
  //   });
  // }

  // if (jsEntries.length) {
  //   configs.push({
  //     ...commonConfig,
  //     entry: jsEntries,
  //     format: ["esm"],
  //     target: NODE_TARGET,
  //     platform: "node",
  //     outDir: "dist/pure-js",
  //   });
  // }

  if (otherEntries.length) {
    configs.push({
      ...commonConfig,
      entry: otherEntries,
      format: ["esm"],
      target: NODE_TARGET,
      platform: "node",
      outDir: "dist",
    });
  }

  return configs;
});
