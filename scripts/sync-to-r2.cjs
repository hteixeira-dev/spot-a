#!/usr/bin/env node
/*
  Sync local hero sequence assets to Cloudflare R2 (S3-compatible).

  Requirements:
  - env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
  - optional env: CDN_BASE_PATH (for seq-loop), CDN_BASE_PATH_SCROLL (for seq-scroll)
  - public CDN URL is not needed for upload; it's used only for delivery.

  Uploads:
  - public/AnimationHero/seq-loop-avif/*.png -> ${CDN_BASE_PATH || 'spot/hero/v1/seq-loop'}
  - public/AnimationHero/seq-scroll/*.png -> ${CDN_BASE_PATH_SCROLL || deriveFrom(CDN_BASE_PATH)}

  It preserves basic metadata (mtime) in object metadata and sets proper Content-Type.
*/
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
require('dotenv').config();

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

const ACCOUNT_ID = required('R2_ACCOUNT_ID');
const ACCESS_KEY_ID = required('R2_ACCESS_KEY_ID');
const SECRET_ACCESS_KEY = required('R2_SECRET_ACCESS_KEY');
const BUCKET = required('R2_BUCKET');

const ENDPOINT = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`;

const s3 = new S3Client({
  region: 'auto',
  endpoint: ENDPOINT,
  credentials: { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY },
});

const root = path.resolve(__dirname, '..');
const dirLoopPng = path.join(root, 'public', 'AnimationHero', 'seq-loop-avif');
const dirScrollPng = path.join(root, 'public', 'AnimationHero', 'seq-scroll');

const baseLoop = process.env.CDN_BASE_PATH || 'spot/hero/v1/seq-loop';
const baseScroll = process.env.CDN_BASE_PATH_SCROLL || baseLoop.replace(/seq-loop$/, 'seq-scroll');

async function uploadDir(localDir, basePath) {
  if (!fs.existsSync(localDir)) {
    console.warn(`[skip] local dir not found: ${localDir}`);
    return [];
  }
  const files = fs.readdirSync(localDir).filter((f) => fs.statSync(path.join(localDir, f)).isFile());
  const uploaded = [];
  for (const f of files) {
    const abs = path.join(localDir, f);
    const key = `${basePath}/${f}`.replace(/\\/g, '/');
    const ct = mime.lookup(f) || 'application/octet-stream';
    const stat = fs.statSync(abs);

    const meta = {
      'x-amz-meta-mtime': String(Math.floor(stat.mtimeMs)),
    };
    process.stdout.write(`Uploading ${key} ... `);
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: fs.createReadStream(abs),
        ContentType: ct,
        CacheControl: 'public, max-age=31536000, immutable',
        Metadata: meta,
      })
    );
    console.log('ok');
    uploaded.push({ key, ct, size: stat.size });
  }
  return uploaded;
}

async function main() {
  const resLoop = await uploadDir(dirLoopPng, baseLoop);
  const resScroll = await uploadDir(dirScrollPng, baseScroll);
  const report = {
    bucket: BUCKET,
    endpoint: ENDPOINT,
    baseLoop,
    baseScroll,
    uploadedLoopCount: resLoop.length,
    uploadedScrollCount: resScroll.length,
    when: new Date().toISOString(),
  };
  const outDir = path.join(__dirname, 'logs');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'sync-to-r2.json');
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
  console.log(`Sync report written to ${outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});