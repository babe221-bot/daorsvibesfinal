import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const SIZES = [16, 32, 48, 64, 128, 256];
const INPUT_LOGO = 'public/logo.png';
const OUTPUT_DIR = 'public/icons';

async function resizeLogo() {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    for (const size of SIZES) {
      const outputFileName = `logo-${size}x${size}.png`;
      const outputPath = path.join(OUTPUT_DIR, outputFileName);

      await sharp(INPUT_LOGO)
        .resize(size, size)
        .toFile(outputPath);

      console.log(`✅ Generated ${outputFileName}`);
    }
  } catch (error) {
    console.error('❌ Error resizing logo:', error);
  }
}

resizeLogo();
