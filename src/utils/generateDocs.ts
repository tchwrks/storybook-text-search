import FastGlob from "fast-glob";
import path from "path";
import { extractTextFromMdx } from "src/utils/extract/extractFromMdx";
// import { extractComponentMetadata } from 'src/utils/extract/extractComponentMetadata';
import type { SearchDoc } from "../scripts/buildTextIndex";
import { TextSearchConfig } from "src/types";

interface GenerateDocsOptions {
  config: TextSearchConfig;
  rootDir: string; // passes in result of process.cwd(). No need for cwd calls in this function
}

export async function generateDocs({
  config,
  rootDir,
}: GenerateDocsOptions): Promise<SearchDoc[]> {
  const inputPaths = config.inputPaths;
  console.log(`🔍 Scanning input paths for documentation files...`);
  console.log(`📂 Input Paths: ${inputPaths.join(", ")}`);
  console.log(`🏠 Root Directory: ${rootDir}`);

  // Normalize input paths for fast-glob on Windows: make them relative to the rootDir when absolute
  // and convert backslashes to forward slashes so globbing works reliably across platforms.
  const adjustedInputPaths = inputPaths.map((p) => {
    const relative = path.isAbsolute(p) ? path.relative(rootDir, p) : p;
    return relative.replace(/\\/g, "/");
  });

  console.log(
    `🔧 Adjusted Input Paths for globbing: ${adjustedInputPaths.join(", ")}`,
  );

  const files = await FastGlob(adjustedInputPaths, {
    cwd: rootDir,
    onlyFiles: true,
    extglob: true,
    unique: true,
    followSymbolicLinks: true,
    dot: true,
    ignore: ["**/node_modules/**", "**/dist/**"],
  });

  console.log(`🔍 Found ${files.length} files in input paths.`);

  // Resolve fast-glob results to absolute paths (fast-glob returns paths relative to `cwd` when `cwd` is set)
  const resolvedFiles = files.map((f) => path.resolve(rootDir, f));

  const mdxFiles = resolvedFiles.filter((f) => f.endsWith(".mdx"));
  // const storyFiles = resolvedFiles.filter(f => /\.stories\.(ts|tsx|js|jsx)$/.test(f));

  const docs: SearchDoc[] = [];

  // Handle MDX
  for (const fullPath of mdxFiles) {
    try {
      const { text, metaTitle } = await extractTextFromMdx({
        filePath: fullPath,
        jsxTextMap: config.jsxTextMap,
        maxJsxDepth: config.maxJsxDepth,
        jsxPropAllowList: config.jsxPropAllowList,
      });
      const content = text.join(" ");
      const relativePath = path.relative(rootDir, fullPath);
      const fileName = path.basename(fullPath).replace(/\.[^/.]+$/, "");
      const baseDocsNavUrl: string = "/?path=/docs";
      // Ensure we don't call methods on `undefined` when no <Meta title="..."/> exists in MDX.
      const slugSource = metaTitle ?? fileName;
      if (!metaTitle)
        console.warn(
          `⚠️ MDX file missing Meta title; using filename for slug: ${fullPath}`,
        );

      const baseDocSlug = slugSource
        .toLowerCase()
        .replace(/^\//, "")
        .replace(/[\/\s_]+/g, "-");
      const formattedDocSlug = `${baseDocSlug}{config.mdxHrefSuffix ?? ""}`;

      const docHref =
        config.pathPrefix && config.pathPrefix.length > 0
          ? `${baseDocsNavUrl}/${config.pathPrefix}/${formattedDocSlug}`
          : `${baseDocsNavUrl}/${formattedDocSlug}`;

      docs.push({
        id: relativePath.replace(/\.[^/.]+$/, ""),
        title: fileName,
        content,
        docHref,
        snippet: content.slice(0, 150).replace(/\s+/g, " ") + "…",
        sourcePath: fullPath,
        metaTitle,
        type: "mdx",
      });
    } catch (err) {
      console.warn(`⚠️ Failed to parse MDX file: ${fullPath}`, err);
    }
  }

  // ⚠️ Not parsing stories + yet
  // Handle Story files
  // for (const fullPath of storyFiles) {
  //     try {
  //         const meta = await extractComponentMetadata(fullPath);
  //         const text: string[] = [];
  //         if (meta?.summary) text.push(meta.summary);
  //         if (meta?.props) {
  //             text.push(...meta.props.map(p => `${p.name} ${p.description ?? ""}`));
  //         }

  //         const content = text.join(" ");
  //         const relativePath = path.relative(process.cwd(), fullPath);
  //         const fileName = path.basename(fullPath).replace(/\.[^/.]+$/, '');

  //         docs.push({
  //             id: relativePath.replace(/\.[^/.]+$/, ''),
  //             title: fileName,
  //             content,
  //             snippet: content.slice(0, 150).replace(/\s+/g, " ") + "…",
  //             sourcePath: fullPath,
  //             metaTitle: undefined,
  //             type: "story"
  //         });
  //     } catch (err) {
  //         console.warn(`⚠️ Failed to parse component metadata for ${fullPath}`, err);
  //     }
  // }
  return docs;
}
