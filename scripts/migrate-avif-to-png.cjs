#!/usr/bin/env node
/**
 * Migrate outdated .avif assets to .png equivalents.
 * 
 * Operations:
 * 1) Remove all .avif files in public/AnimationHero/seq-loop-avif and seq-scroll-avif
 * 2) Create .png files with the same base names (only changing extension)
 *    - Loop: convert existing WEBP (public/AnimationHero/seq-loop/HERO_LOOP###.webp) to PNG
 *    - Scroll: copy from PNG source (public/AnimationHero/seq-scroll/spot_hero copy###.png) to target name HERO_QUEDA###.png
 * 3) Verify basic integrity via sharp metadata read
 * 4) Preserve timestamps and file mode where applicable
 * 5) Write a migration report to scripts/logs/migration-avif-to-png.json
 */

const fs = require('fs');
const path = require('path');
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.warn('[WARN] sharp not available. Install it to enable metadata verification.');
}

const root = path.resolve(__dirname, '..');
const pub = path.join(root, 'public', 'AnimationHero');
const dirLoopAvif = path.join(pub, 'seq-loop-avif');
const dirLoopWebp = path.join(pub, 'seq-loop');
const dirScrollAvif = path.join(pub, 'seq-scroll-avif');
const dirScrollPng = path.join(pub, 'seq-scroll');

function listFiles(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.toLowerCase().endsWith('.' + ext))
    .map(f => path.join(dir, f))
    .sort();
}

function pad3(n) { return String(n).padStart(3, '0'); }

async function convertWebpToPng(srcWebp, destPng) {
  if (!sharp) {
    // Fallback: binary copy won't convert formats. Abort.
    throw new Error('sharp is required to convert WEBP to PNG');
  }
  await sharp(srcWebp).png({ compressionLevel: 9 }).toFile(destPng);
}

function copyPreserve(src, dest, modeFrom, timesFrom) {
  fs.copyFileSync(src, dest);
  try {
    if (modeFrom !== undefined) fs.chmodSync(dest, modeFrom);
    if (timesFrom) fs.utimesSync(dest, timesFrom.atime, timesFrom.mtime);
  } catch (e) {
    // Non-fatal on Windows
  }
}

async function verifyImageMeta(file) {
  if (!sharp) return { verified: false, meta: null };
  try {
    const meta = await sharp(file).metadata();
    return { verified: true, meta };
  } catch (e) {
    return { verified: false, error: String(e) };
  }
}

async function processLoop() {
  const avifs = listFiles(dirLoopAvif, 'avif');
  const changes = [];
  for (const avif of avifs) {
    const base = path.basename(avif, '.avif');
    const idxMatch = base.match(/HERO_LOOP(\d{3})/);
    if (!idxMatch) continue;
    const idx = idxMatch[1];
    const srcWebp = path.join(dirLoopWebp, `HERO_LOOP${idx}.webp`);
    const destPng = path.join(dirLoopAvif, `HERO_LOOP${idx}.png`);
    const st = fs.statSync(avif);

    if (!fs.existsSync(srcWebp)) {
      changes.push({ file: destPng, status: 'skip_no_source_webp' });
      continue;
    }

    await convertWebpToPng(srcWebp, destPng);
    copyPreserve(destPng, destPng, st.mode, { atime: st.atime, mtime: st.mtime });
    const verify = await verifyImageMeta(destPng);
    fs.unlinkSync(avif);
    changes.push({ file: destPng, replaced: 'avif->png(webp)', verify });
  }
  return changes;
}

async function processScroll() {
  const avifs = listFiles(dirScrollAvif, 'avif');
  const changes = [];
  for (const avif of avifs) {
    const base = path.basename(avif, '.avif');
    const idxMatch = base.match(/HERO_QUEDA(\d{3})/);
    if (!idxMatch) continue;
    const idx = idxMatch[1];
    const srcPng = path.join(dirScrollPng, `spot_hero copy${idx}.png`);
    const destPng = path.join(dirScrollAvif, `HERO_QUEDA${idx}.png`);
    const st = fs.statSync(avif);

    if (!fs.existsSync(srcPng)) {
      changes.push({ file: destPng, status: 'skip_no_source_png' });
      continue;
    }

    copyPreserve(srcPng, destPng, st.mode, { atime: st.atime, mtime: st.mtime });
    const verify = await verifyImageMeta(destPng);
    fs.unlinkSync(avif);
    changes.push({ file: destPng, replaced: 'avif->png(copy)', verify });
  }
  return changes;
}

async function main() {
  const reportDir = path.join(root, 'scripts', 'logs');
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, 'migration-avif-to-png.json');

  const loopChanges = await processLoop();
  const scrollChanges = await processScroll();

  const report = {
    when: new Date().toISOString(),
    loop: loopChanges,
    scroll: scrollChanges,
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log('[MIGRATION] Completed. Report at', path.relative(root, reportPath));
}

main().catch(err => {
  console.error('[MIGRATION] Failed:', err);
  process.exit(1);
});