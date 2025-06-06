#!/usr/bin/env node

// TODO: Review quote style detection logic
// TODO: Abstract / lift helper functions and utils

import path from 'path';
import { Project, SourceFile, SyntaxKind, ObjectLiteralExpression, ArrayLiteralExpression, PropertyAssignment } from 'ts-morph';
import fs from 'fs';

interface ModifyOptions {
    path: string;
    addonName: string;
    staticDir: string;
}

type StorybookMainStories = string[];

/** Helper for changing Storybook's stories glob into a format fast-glob accepts */
function fixStorybookGlob(pattern: string): string {
    return pattern.replace(/@\(([^)]+)\)/g, (_match, group) => {
        return `{${group.replace(/\|/g, ',')}}`;
    });
};

/** Helper to detect and maintain found quote style (single vs double) */
function detectPreferredQuoteStyle(source: SourceFile): '"' | "'" {
    const firstString = source.getDescendantsOfKind(SyntaxKind.StringLiteral)[0];
    if (!firstString) return '"'; // fallback

    const raw = firstString.getText();
    return raw.startsWith("'") ? "'" : '"';
}

/** Helper for getting property of object literal w/ matching key name--ignores quote style, if present */
function getPropertyByKeyInsensitive(obj: ObjectLiteralExpression, key: string): PropertyAssignment | undefined {
    return obj.getProperties().find((prop) => {
        if (prop.getKind() !== SyntaxKind.PropertyAssignment) return false;
        const name = (prop as PropertyAssignment).getNameNode().getText().replace(/['"`]/g, '');
        return name === key;
    }) as PropertyAssignment | undefined;
}

/** Helper for node array validation */
function ensureArrayProperty(obj: ObjectLiteralExpression, key: string): ArrayLiteralExpression | null {
    const existing = getPropertyByKeyInsensitive(obj, key);

    if (existing) {
        const initializer = existing.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
        if (!initializer) {
            throw new Error(`Expected '${key}' to be an array in your Storybook config.`);
        }
        return initializer;
    }

    return null; // Field not found
};

/** Helper for path normalization */
function normalizePath(value: string): string {
    return path.resolve(value).replace(/\\/g, '/');
};

/** Helper for adding unique value to array with single-quotes */
function addUniqueValueToArray(arrayNode: ArrayLiteralExpression, value: string, preferredQuote: '"' | "'"): boolean {
    const normalizedValue = normalizePath(value);
    const alreadyExists = arrayNode.getElements().some(el => {
        const elementValue = el.getText().replace(/['"`]/g, '');
        return normalizePath(elementValue) === normalizedValue;
    });

    if (!alreadyExists) {
        arrayNode.addElement(`${preferredQuote}${value}${preferredQuote}`);
        return true;
    }

    return false;
}
/** Helper for node array parsing */
function getLiteralArrayValues(arrayNode: ArrayLiteralExpression): string[] {
    return arrayNode.getElements().map(el => el.getText().replace(/['"`]/g, ''));
};

/** Helper for pulling object from from default export */
function resolveObjectLiteralFromExport(exportAssignment: any, sourceFile: any): ObjectLiteralExpression | undefined {
    const expr = exportAssignment.getExpression();

    if (!expr) return;

    if (expr.getKind() === SyntaxKind.ObjectLiteralExpression) {
        return expr as ObjectLiteralExpression;
    }

    if (expr.getKind() === SyntaxKind.Identifier) {
        const identifier = expr;
        const name = identifier.getText();
        const varDecl = sourceFile.getVariableDeclaration(name);
        const initializer = varDecl?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
        return initializer;
    }

    return;
}

export async function modifyStorybookMain({
    path: mainPath,
    addonName,
    staticDir,
}: ModifyOptions): Promise<StorybookMainStories> {
    if (!fs.existsSync(mainPath)) {
        console.error(`❌ Storybook config not found at ${mainPath}`);
        process.exit(1);
    }

    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(mainPath);
    if (sourceFile) console.log('🔍 Found Storybook config at', mainPath);

    const exportAssignment = sourceFile.getExportAssignments()[0];
    if (!exportAssignment) {
        throw new Error('❌ Could not find `export default` in Storybook main file.');
    }

    const configObject = resolveObjectLiteralFromExport(exportAssignment, sourceFile);

    // Exit early if no config exists
    if (!configObject) {
        console.log('❌ Storybook main does not export a recognizable config object (direct or named).');
        return [];
    }

    const storiesArray = ensureArrayProperty(configObject, 'stories');
    const addonsArray = ensureArrayProperty(configObject, 'addons');
    const staticDirsArray = ensureArrayProperty(configObject, 'staticDirs');

    // Exit early if necessary fields aren't found. Possibly malformed .storybook/main
    // Exit early if required fields aren't found
    if (!storiesArray || !addonsArray || !staticDirsArray) {
        console.log('❌ One or more required fields (stories, addons, staticDirs) not found in your Storybook config. Aborting without making changes.');
        return [];
    }

    const preferredQuote = detectPreferredQuoteStyle(sourceFile);
    const addedAddon = addUniqueValueToArray(addonsArray, addonName, preferredQuote);
    const addedStaticDir = addUniqueValueToArray(staticDirsArray, staticDir, preferredQuote);

    const rawGlobs = getLiteralArrayValues(storiesArray);
    const fixed = rawGlobs.map(pattern => {
        let adjusted = fixStorybookGlob(pattern);

        if (adjusted !== pattern) {
            console.log(`🔧 Rewrote glob for .storybook-text-search: ${pattern} -> ${adjusted}`);
        }

        const mainDir = path.dirname(mainPath); // e.g., /path/to/project/.storybook
        const storybookDirName = path.basename(mainDir); // ".storybook"

        const mainDirRelativeToSearchConfig = path.relative(
            path.resolve(mainDir, '.storybook-text-search'),
            mainDir
        ).replace(/\\/g, '/');

        if (adjusted.startsWith('./')) {
            // "./docs/**/*.mdx" should become "../.storybook/docs/**/*.mdx"
            adjusted = `${mainDirRelativeToSearchConfig}/${storybookDirName}/${adjusted.slice(2)}`;
            console.log(`📂 Adjusted glob path for config.inputPaths: ${pattern} → ${adjusted}`);
        }

        return adjusted;
    });

    if (!addedAddon && !addedStaticDir) {
        console.log('⚠️ Storybook config already contains required fields. No changes made.');
        return fixed;
    }

    await sourceFile.save();

    if (addedAddon) {
        console.log(`✅ Added ${addonName} to addons configuration array`);
    }
    if (addedStaticDir) {
        console.log(`✅ Added ${staticDir} (search index artifacts) to staticDirs configuration array`);
    }

    console.log(`✅ Storybook config updated at ${mainPath}`);
    console.log("📦 Raw Storybook globs:", rawGlobs);

    return fixed;
}