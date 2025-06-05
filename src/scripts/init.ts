import * as fs from 'fs';
import * as path from 'path';
import { modifyStorybookMain } from './modifySbMain';
import { buildTextIndex } from './buildTextIndex';
import { createTextSearchConfig } from 'src/scripts/createSearchConfig';

/**
 * Main init function for text search addon. Performs the following:
 * 1. Check for TS config
 * 2. Check for `.storybook/main.js|ts`. Exit early if does not exist
 * 3. Add addon to end of Storybook addon array
 * 4. Create `.text-search/` dir at root
 * 5. Create `artifacts` dir in `.text-search/`
 * 6. Add artifacts path to Storybook asset dir array
 * 7. Create `config.ts|js` in `.text-search/`
 * 8. Generate initial index
 */
const main = async (): Promise<void> => {
    const projectRoot = process.cwd();

    // 1
    const isTs = fs.existsSync(path.join(projectRoot, 'tsconfig.json'));

    // 2
    const hasStorybookMain = fs.existsSync('./.storybook/main.js') || fs.existsSync('./.storybook/main.ts');
    if (!hasStorybookMain) {
        console.error('Storybook main file not found. Please ensure Storybook is installed and that a main.js or main.ts file exists in .storybook/');
        process.exit(1);
    }

    // 3
    const storybookMainPath = isTs ? './.storybook/main.ts' : './.storybook/main.js';

    // 4 + 5
    fs.mkdirSync(path.join(projectRoot, '.storybook-text-search'), { recursive: true });
    fs.mkdirSync(path.join(projectRoot, '.storybook-text-search/artifacts'), { recursive: true });

    // 6
    const stories = await modifyStorybookMain({
        path: storybookMainPath,
        addonName: "@tchwrks/storybook-text-search",
        staticDir: "../.storybook-text-search/artifacts"
    });

    // 7
    await createTextSearchConfig({
        targetDir: path.join(projectRoot, '.storybook-text-search'),
        stories,
    });

    // 8
    await buildTextIndex();
};

export { main }; 
