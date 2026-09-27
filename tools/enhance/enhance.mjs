import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC = path.resolve("../..", "_zip_extract");
const DEST = path.resolve("../..", "public", "frames");

fs.mkdirSync(DEST, { recursive: true });

const files = fs
  .readdirSync(SRC)
  .filter((f) => /^ezgif-frame-\d{3}\.jpg$/.test(f))
  .sort();

let totalBytes = 0;

for (const file of files) {
  const n = file.match(/\d{3}/)[0];
  const out = path.join(DEST, `f${n}.webp`);
  const buf = await sharp(path.join(SRC, file))
    .resize({ width: 1280, height: 720, kernel: "lanczos3" })
    .sharpen({ sigma: 1.1, m1: 0.8, m2: 2.2 })
    .normalise({ lower: 1, upper: 99 })
    .modulate({ brightness: 1.03, saturation: 1 })
    .webp({ quality: 78, effort: 4 })
    .toBuffer();
  fs.writeFileSync(out, buf);
  totalBytes += buf.length;
}

console.log(`Processed ${files.length} frames`);
console.log(`Total size: ${(totalBytes / 1024 / 1024).toFixed(1)} MB`);
