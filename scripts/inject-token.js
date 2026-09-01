/**
 * inject-token.js
 * ---------------
 * Vercel build-time script: reads MAPBOX_TOKEN from environment variables and
 * replaces the ___MAPBOX_TOKEN_PLACEHOLDER___ string in the static JS files.
 *
 * This is the ONLY correct approach for a static site (no bundler):
 *   - process.env is NOT available in the browser
 *   - This script runs server-side on Vercel's build worker
 *   - The output files contain the real token baked in as a plain string
 *
 * Configure in Vercel Dashboard:
 *   Settings > Environment Variables > MAPBOX_TOKEN = <your new token>
 */

const fs = require('fs');
const path = require('path');

const PLACEHOLDER = '___MAPBOX_TOKEN_PLACEHOLDER___';
const token = process.env.MAPBOX_TOKEN;

if (!token) {
    console.error('\n❌ ERROR: MAPBOX_TOKEN environment variable is not set.');
    console.error('   Add it in Vercel Dashboard > Settings > Environment Variables.\n');
    process.exit(1);
}

if (token === PLACEHOLDER || token.startsWith('___')) {
    console.error('\n❌ ERROR: MAPBOX_TOKEN looks like a placeholder — set a real token.\n');
    process.exit(1);
}

const TARGET_FILES = [
    path.join(__dirname, '..', 'assets', 'pages', 'index', 'app.js'),
    path.join(__dirname, '..', 'assets', 'pages', 'spatial-analysis', 'app.js'),
];

let injectedCount = 0;
for (const filePath of TARGET_FILES) {
    const original = fs.readFileSync(filePath, 'utf-8');
    if (!original.includes(PLACEHOLDER)) {
        console.log(`ℹ️  No placeholder found in: ${filePath} (already injected or not present)`);
        continue;
    }
    const updated = original.replaceAll(PLACEHOLDER, token);
    fs.writeFileSync(filePath, updated, 'utf-8');
    console.log(`✅ Injected MAPBOX_TOKEN into: ${filePath}`);
    injectedCount++;
}

if (injectedCount === 0) {
    console.warn('\n⚠️  Warning: MAPBOX_TOKEN placeholder was not found in any target file.');
    console.warn('   The map pages may already be using a hardcoded token — audit them.\n');
} else {
    console.log(`\n✅ Done. Token injected into ${injectedCount} file(s). Map will load correctly.\n`);
}
