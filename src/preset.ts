// You can use presets to augment the Storybook configuration
// You rarely want to do this in addons,
// so often you want to delete this file and remove the reference to it in package.json#exports and package.json#bunder.nodeEntries
// Read more about presets at https://storybook.js.org/docs/addons/writing-presets

import { buildTextIndex } from "./scripts/buildTextIndex";
import { ViteDevServer } from "vite";
import type { Compiler } from "webpack";

const buildIndexOnStartup = async () => {
  console.log("🛠️ Building storybook-text-search index...")
  const { docs } = await buildTextIndex();
};

const rebuildIndex = async () => {
  const { docs } = await buildTextIndex();
  if (docs.length > 0) {
    console.log("✅ storybook-text-search index rebuilt with", docs.length, "docs!");
  } else {
    console.log("❌ No docs found in storybook-text-search index!");
  }
};


export const viteFinal = async (config: any) => {
  config.plugins.push({
    name: "storybook-text-search-rebuild-index",
    configureServer: async (server: ViteDevServer) => {
      const chokidar = server.watcher;

      chokidar.on("change", async (filePath) => {
        // ! Little bit of a short circuit. Will need to change this when parsing stories and autodocs
        if (filePath.endsWith(".mdx")) {
          console.log("🔍 Detected .mdx file change. Rebuilding storybook-text-search index");
          await rebuildIndex();
        }
      })
    }
  })
  await buildIndexOnStartup();
  return config;
};

export const webpack = async (config: any) => {
  config.plugins.push({
    apply: (compiler: Compiler) => {
      compiler.hooks.watchRun.tapPromise(
        "storybook-text-search-rebuild-index",
        async (compiler: Compiler) => {
          const modified = (compiler as any).modifiedFiles as Set<string> | undefined;

          if (modified) {
            const changed = Array.from(modified).filter(file =>
              file.endsWith(".mdx")
            );

            if (changed.length > 0) {
              console.log("🔍 Detected .mdx file change. Rebuilding storybook-text-search index");
              await rebuildIndex();
            }
          }
        }
      );
    }
  });

  await buildIndexOnStartup();
  return config;
};