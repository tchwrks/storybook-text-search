
// CJS
// const path = require('path');
// const { pathToFileURL } = require('url');

// (async () => {
//     const esmPath = pathToFileURL(path.resolve(__dirname, '../scripts/buildTextIndex.js')).href;

//     const { buildTextIndex } = await import(esmPath);
//     buildTextIndex();
// })();

// const { buildTextIndex } = require('src/pure-js/scripts/buildTextIndex.cjs');
// buildTextIndex();

import { buildTextIndex } from "../scripts/buildTextIndex";
buildTextIndex();
