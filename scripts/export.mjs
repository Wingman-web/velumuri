// Static export for shared hosting (e.g. Hostinger public_html):
//   npm run export   →   out/
// Runs `next build` with STATIC_EXPORT=1 (see next.config.ts), then copies
// each nested RSC segment payload (out/<route>/__next.<seg>/<...>/__PAGE__.txt)
// to the flat dotted name the client router prefetches
// (out/<route>/__next.<seg>.<...>.__PAGE__.txt) — a plain static server has
// no rewrite for that, so without the copies every prefetch 404s and
// navigation falls back to full page loads.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const out = path.join(root, 'out');

const build = spawnSync('npx next build', { cwd: root, stdio: 'inherit', shell: true, env: { ...process.env, STATIC_EXPORT: '1' } });
if (build.status !== 0) process.exit(build.status ?? 1);

let copied = 0;
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('__next.')) {
      const flatten = (d, prefix) => {
        for (const e of fs.readdirSync(d, { withFileTypes: true })) {
          const p = path.join(d, e.name);
          if (e.isDirectory()) flatten(p, `${prefix}.${e.name}`);
          else { fs.copyFileSync(p, path.join(dir, `${prefix}.${e.name}`)); copied++; }
        }
      };
      flatten(full, entry.name);
    } else if (entry.name !== '_next') {
      walk(full);
    }
  }
};
walk(out);
console.log(`\nStatic export ready in out/ (${copied} prefetch payloads flattened).`);
