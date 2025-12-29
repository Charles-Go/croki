import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '../public/icons');

// Ensure icons directory exists
mkdirSync(iconsDir, { recursive: true });

const svgBuffer = readFileSync(join(iconsDir, 'icon.svg'));

const sizes = [192, 512];

async function generateIcons() {
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(iconsDir, `icon-${size}.png`));
    console.log(`Generated icon-${size}.png`);
  }

  // Also generate a favicon
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(__dirname, '../public/favicon.png'));
  console.log('Generated favicon.png');
}

generateIcons().catch(console.error);
