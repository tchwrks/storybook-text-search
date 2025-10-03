#!/usr/bin/env node

// TODO: Accept CJS as well as ESM (.mjs)

import path from 'path';
import fs from 'fs/promises';
import {
    Project,
    QuoteKind,
    IndentationText,
    VariableDeclarationKind,
} from 'ts-morph';

interface CreateConfigOptions {
    targetDir: string;
    fileName?: string; // optional override, defaults to `search.config.js`
    stories?: string[];
}
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export async function createTextSearchConfig({
    targetDir,
    fileName,
    stories,
}: CreateConfigOptions): Promise<void> {
    const resolvedFileName = fileName ?? 'config.mjs';
    const filePath = path.join(targetDir, resolvedFileName);

    const alreadyExists = await fs.stat(filePath).then(() => true).catch(() => false);

    const defaultStories = stories.length > 0 ? stories : ['../src/stories/**/*.mdx', '../src/**/*.stories.tsx'];

    if (alreadyExists) {
        console.log(`⚠️  ${resolvedFileName} already exists at ${filePath}. Skipping creation.`);
        return;
    }

    const project = new Project({
        useInMemoryFileSystem: false,
        manipulationSettings: {
            quoteKind: QuoteKind.Single,
            indentationText: IndentationText.TwoSpaces,
            useTrailingCommas: true,
        },
    });

    const sourceFile = project.createSourceFile(filePath, '', { overwrite: false });

    // Add JSDoc-style type annotation comment for JS
    // sourceFile.insertText(0, `/** @type {import('src/types/index').TextSearchConfig} */\n`);

    // get optional pathPrefix
    const rl = readline.createInterface({ input, output });
    const pathPrefixRes = await rl.question('Are you deploying Storybook to a subpath (e.g. GitHub Pages repo w/o a custom domain)?\nIf so, enter the path prefix (e.g. "name-of-your-repo"). Otherwise, press enter to skip  ');
    rl.close();
    const pathPrefix = pathPrefixRes && pathPrefixRes.trim().length > 0
        ? `'${pathPrefixRes.trim()}'`
        : undefined;

    sourceFile.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
            {
                name: 'config',
                initializer: writer => {
                    writer.write('{').indent(() => {
                        writer.writeLine(`inputPaths: ${JSON.stringify(defaultStories)},`);
                        writer.writeLine(`pathPrefix: ${pathPrefix},`);
                        // writer.writeLine(`outputDebugJson: true,`); // !deprecated flag
                        writer.writeLine(`maxJsxDepth: 5,`);
                        writer.writeLine(`jsxPropAllowList: ['alt', 'title', 'aria-label', 'placeholder', 'label', 'value', 'children'],`);
                    }).write('}');
                },
            },
        ],
    });

    sourceFile.addExportAssignment({
        expression: 'config',
        isExportEquals: false,
    });

    await sourceFile.save();

    console.log(`✅ Created ${resolvedFileName} at ${filePath}`);
}
