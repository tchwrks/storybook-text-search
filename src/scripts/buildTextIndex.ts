#!/usr/bin/env node

import path from 'path';
import fs from 'fs/promises';
import { generateDocs } from '../utils/generateDocs';
import MiniSearch from 'minisearch';
import { TextSearchConfig } from 'src/types';
import { pathToFileURL } from 'url';


export interface SearchDoc {
    id: string;
    title: string;
    content: string;
    metaTitle?: string;
    snippet?: string;
    sourcePath: string;
    type?: 'mdx' | 'story' | 'other';
    [key: string]: string | undefined;
}

const TOOL_DIR = '.storybook-text-search';
const CONFIG_FILE = 'config.js';


export async function buildTextIndex() {
    const toolDirPath = path.resolve(process.cwd(), TOOL_DIR);
    const configPath = path.resolve(toolDirPath, CONFIG_FILE);

    try {
        await fs.access(configPath);
    } catch {
        throw new Error(`❌ No ${CONFIG_FILE} found in ${TOOL_DIR}`);
    }

    const configUrl = pathToFileURL(configPath).href;
    const config: TextSearchConfig = (await import(configUrl)).default;

    if (Array.isArray(config.inputPaths)) {
        config.inputPaths = config.inputPaths.map(p => path.resolve(toolDirPath, p));
    } else {
        throw new Error("❌ config.inputPaths must be an array of string(s). If using a single path, please place it in an array");
    }

    const docs: SearchDoc[] = await generateDocs({ config: config, rootDir: toolDirPath });

    // MiniSearch
    const mini = new MiniSearch({
        fields: ['title', 'content'],
        storeFields: ['id', 'title', 'content', 'snippet', 'sourcePath', 'type', 'metaTitle'],
        searchOptions: {
            boost: { title: 2 },
            prefix: true,
            fuzzy: 0.2,
        },
    });
    mini.addAll(docs);

    const outputDir = path.resolve(process.cwd(), TOOL_DIR, 'artifacts');
    await fs.mkdir(outputDir, { recursive: true });


    await fs.writeFile(path.join(outputDir, 'text-search-docs.json'), JSON.stringify(docs, null, 2));


    if (docs.length > 0 && mini.documentCount > 0) {
        console.log("✅ storybook-text-search index built with", docs.length, "docs!");
    } else {
        console.log("❌ No docs found in storybook-text-search index!");
    }

    return { docs };
}