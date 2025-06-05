#!/usr/bin/env node

// TODO: Switch to double quotes + fix extraneous indent in addon array
import path from 'path';
import { Project, SyntaxKind, ObjectLiteralExpression, ArrayLiteralExpression, PropertyAssignment } from 'ts-morph';
import fs from 'fs';

interface ModifyOptions {
    path: string;
    addonName: string;
    staticDir: string;
}

type StorybookMainStories = string[];

function fixStorybookGlob(pattern: string): string {
    return pattern.replace(/@\(([^)]+)\)/g, (_match, group) => {
        return `{${group.replace(/\|/g, ',')}}`;
    });
};

function ensureArrayProperty(obj: ObjectLiteralExpression, key: string): ArrayLiteralExpression {
    const existing = obj.getProperty(key);

    if (existing) {
        if (existing.getKind() === SyntaxKind.PropertyAssignment) {
            const initializer = (existing as PropertyAssignment).getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
            if (!initializer) {
                throw new Error(`Expected '${key}' to be an array in your Storybook config.`);
            }
            return initializer;
        }
        throw new Error(`Expected '${key}' to be a property assignment in your Storybook config.`);
    }

    // Add empty array if missing
    return obj.addPropertyAssignment({
        name: key,
        initializer: '[]',
    }).getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);
}

function normalizePath(value: string): string {
    return path.resolve(value).replace(/\\/g, '/');
}

function addUniqueValueToArray(arrayNode: ArrayLiteralExpression, value: string): boolean {
    const normalizedValue = normalizePath(value);

    const alreadyExists = arrayNode.getElements().some(el => {
        const elementValue = el.getText().replace(/['"`]/g, '');
        return normalizePath(elementValue) === normalizedValue;
    });

    if (!alreadyExists) {
        arrayNode.addElement(`'${value}'`);
        return true;
    }

    return false;
}

function getLiteralArrayValues(arrayNode: ArrayLiteralExpression): string[] {
    return arrayNode.getElements().map(el => el.getText().replace(/['"`]/g, ''));
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

    const configObject = resolveObjectLiteralFromExport(exportAssignment, sourceFile);

    if (!configObject) {
        throw new Error('❌ Storybook main does not export a recognizable config object (direct or named).');
    }

    const storiesArray = ensureArrayProperty(configObject, 'stories');
    const addonsArray = ensureArrayProperty(configObject, 'addons');
    const staticDirsArray = ensureArrayProperty(configObject, 'staticDirs');

    const addedAddon = addUniqueValueToArray(addonsArray, addonName);
    const addedStaticDir = addUniqueValueToArray(staticDirsArray, staticDir);

    await sourceFile.save();

    if (addedAddon) {
        console.log(`✅ Added ${addonName} to addons configuration array`);
    }
    if (addedStaticDir) {
        console.log(`✅ Added ${staticDir} (search index artifacts) to staticDirs configuration array`);
    }

    console.log(`✅ Storybook config updated at ${mainPath}`);

    const rawGlobs = getLiteralArrayValues(storiesArray);
    console.log("📦 Raw Storybook globs:", rawGlobs);

    const fixed = rawGlobs.map(pattern => {
        const fixed = fixStorybookGlob(pattern);
        if (fixed !== pattern) {
            console.log(`🔧 Rewrote glob: ${pattern} -> ${fixed}`);
        }
        return fixed;
    });

    return fixed;
}