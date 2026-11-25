// One-off script: render PWA PNG icons from the brand SVG mark.
// Usage: npm run generate:icons
// Outputs: public/icons/icon-{192,512}.png (+ maskable variants on brand blue).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC_SVG = path.join(ROOT, "public", "agahflogo.svg");
const OUT_DIR = path.join(ROOT, "public", "icons");
const BRAND_BG = "#0ea5e9";

const PADDED = 0.8; // logo occupies 80% of the maskable canvas (safe zone)

const targets = [
  { name: "icon-192.png", size: 192, maskable: false },
  { name: "icon-512.png", size: 512, maskable: false },
  { name: "icon-maskable-192.png", size: 192, maskable: true },
  { name: "icon-maskable-512.png", size: 512, maskable: true },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const { name, size, maskable } of targets) {
    const out = path.join(OUT_DIR, name);
    const logoSize = maskable ? Math.round(size * PADDED) : size;

    const logo = await sharp(SRC_SVG, { density: 512 })
      .resize(logoSize, logoSize, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: maskable ? BRAND_BG : { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: logo }])
      .png()
      .toFile(out);

    console.log(`wrote ${path.relative(ROOT, out)} (${size}x${size}${maskable ? ", maskable" : ""})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
