// Copies the tracks from "assets (all)/audio" into public/audio before dev/build.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.resolve(root, '..', 'assets (all)', 'audio');
const dest = path.join(root, 'public', 'audio');
fs.mkdirSync(dest, { recursive: true });
if (!fs.existsSync(src)) {
  console.warn('[audio] source folder not found:', src);
  process.exit(0);
}
const keep = new Set();
for (const f of fs.readdirSync(src)) {
  if (!/\.(mp3|ogg|wav|m4a|aac|flac)$/i.test(f)) continue;
  keep.add(f);
  const to = path.join(dest, f);
  if (!fs.existsSync(to) || fs.statSync(to).mtimeMs < fs.statSync(path.join(src, f)).mtimeMs) {
    fs.copyFileSync(path.join(src, f), to);
  }
}
for (const f of fs.readdirSync(dest)) if (!keep.has(f)) fs.rmSync(path.join(dest, f));
console.log(`[audio] ${keep.size} track(s) synced`);
