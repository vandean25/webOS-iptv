import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, '../package.json');
const appInfoPath = path.resolve(__dirname, '../public/appinfo.json');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const version = packageJson.version;

console.log(`Syncing version ${version} to appinfo.json...`);

// Read appinfo.json
let appInfo = {};
if (fs.existsSync(appInfoPath)) {
    appInfo = JSON.parse(fs.readFileSync(appInfoPath, 'utf-8'));
} else {
    console.error('public/appinfo.json not found!');
    process.exit(1);
}

// Update version
appInfo.version = version;

// Write appinfo.json
fs.writeFileSync(appInfoPath, JSON.stringify(appInfo, null, 2) + '\n');

console.log('Successfully updated appinfo.json');
