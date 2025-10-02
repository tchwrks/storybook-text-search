import FastGlob from 'fast-glob';
import path from 'path';
import { extractTextFromMdx } from 'src/utils/extract/extractFromMdx';
// import { extractComponentMetadata } from 'src/utils/extract/extractComponentMetadata';
import type { SearchDoc } from '../scripts/buildTextIndex';
import { TextSearchConfig } from 'src/types';

interface GenerateDocsOptions {
    config: TextSearchConfig;
    rootDir: string; // passes in result of process.cwd(). No need for cwd calls in this function
}

export async function generateDocs({ config, rootDir }: GenerateDocsOptions): Promise<SearchDoc[]> {
    const inputPaths = config.inputPaths;
    const files = await FastGlob(inputPaths, {
        cwd: rootDir,
        onlyFiles: true,
        extglob: true,
        unique: true,
        followSymbolicLinks: true,
        dot: true,
        ignore: ["**/node_modules/**", "**/dist/**"]
    });

    const mdxFiles = files.filter(f => f.endsWith('.mdx'));
    // const storyFiles = files.filter(f => /\.stories\.(ts|tsx|js|jsx)$/.test(f));

    const docs: SearchDoc[] = [];

    // Handle MDX
    for (const fullPath of mdxFiles) {
        try {
            const { text, metaTitle } = await extractTextFromMdx({
                filePath: fullPath,
                jsxTextMap: config.jsxTextMap,
                maxJsxDepth: config.maxJsxDepth,
                jsxPropAllowList: config.jsxPropAllowList
            });
            const content = text.join(" ");
            const relativePath = path.relative(rootDir, fullPath);
            const fileName = path.basename(fullPath).replace(/\.[^/.]+$/, '');
            const baseDocsNavUrl: string = '/?path=/docs';
            const formattedDocSlug = metaTitle.toLowerCase().replace(/^\//, '').replace(/[\/\s_]+/g, '-');
            const docHref = config.pathPrefix && config.pathPrefix.length > 0
                ? `${baseDocsNavUrl}/${config.pathPrefix}/${formattedDocSlug}`
                : `${baseDocsNavUrl}/${formattedDocSlug}`;

            docs.push({
                id: relativePath.replace(/\.[^/.]+$/, ''),
                title: fileName,
                content,
                docHref,
                snippet: content.slice(0, 150).replace(/\s+/g, " ") + "…",
                sourcePath: fullPath,
                metaTitle,
                type: "mdx"
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
