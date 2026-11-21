import { copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const client = path.resolve('build/client');
const source = path.join(client, '__spa-fallback.html', 'index.html');

if (!existsSync(source)) {
  throw new Error('Missing prerendered 404 page');
}

copyFileSync(source, path.join(client, '404.html'));
