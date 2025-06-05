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
    const configPath = path.resolve(process.cwd(), TOOL_DIR, CONFIG_FILE);
    console.log(configPath);

    try {
        await fs.access(configPath);
    } catch {
        throw new Error(`❌ No ${CONFIG_FILE} found in ${TOOL_DIR}`);
    }

    const configUrl = pathToFileURL(configPath).href;
    const config: TextSearchConfig = (await import(configUrl)).default;
    console.log(config);
    if (config.outputDebugJson) {
        console.log('📦 Loaded config outputting both index and docs');
    } else {
        console.log("📦 Loaded config outputting index only");
    }

    // Flexsearch
    const docs: SearchDoc[] = await generateDocs({ config: config, rootDir: process.cwd() });

    // const index = new Document({
    //     tokenize: 'forward',
    //     worker: false,
    //     document: {
    //         id: 'id',
    //         index: ['title', 'content'],
    //         store: ['id', 'title', 'content', 'snippet', 'sourcePath', 'type', 'metaTitle'],
    //     },
    // });

    // docs.forEach(doc => index.add(doc));

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
    // console.log("MiniSearch index built", mini.toJSON());

    const outputDir = path.resolve(process.cwd(), TOOL_DIR, 'artifacts');
    await fs.mkdir(outputDir, { recursive: true });

    if (config.outputDebugJson) {
        await fs.writeFile(path.join(outputDir, 'text-search-docs.json'), JSON.stringify(docs, null, 2));
    }

    // const serializedIndex: Record<string, string> = {};
    // index.export((key, data) => {
    //     serializedIndex[key] = data;
    // });

    // await fs.writeFile(path.join(outputDir, 'text-search-index.json'), JSON.stringify(serializedIndex, null, 2));

    const miniIndexJson = mini.toJSON();
    await fs.writeFile(
        path.join(outputDir, 'mini-text-search-index.json'),
        JSON.stringify(miniIndexJson, null, 2)
    );

    if (docs.length > 0 && miniIndexJson.documentCount > 0) {
        console.log("✅ storybook-text-search index built with", docs.length, "docs!");
    } else {
        console.log("❌ No docs found in storybook-text-search index!");
    }

    return { docs, miniIndexJson };
}