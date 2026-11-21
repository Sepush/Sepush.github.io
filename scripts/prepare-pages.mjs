import { copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const client = path.resolve('build/client');
const notFound = path.join(client, '404', 'index.html');
const fallback = path.join(client, '__spa-fallback.html');
const source = existsSync(notFound) ? notFound : fallback;

if (!existsSync(source)) {
  throw new Error('Missing prerendered 404 page');
}

copyFileSync(source, path.join(client, '404.html'));
