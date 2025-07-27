import { promises as fs } from 'fs';
import fetch from 'node-fetch';
import path from 'path';

const LOGO_URL = 'https://gs://website-5a18c.firebasestorage.app/generated-image%20(6).png';
const OUTPUT_PATH = 'public/logo.png';

async function downloadLogo() {
  try {
    const response = await fetch(LOGO_URL);
    if (!response.ok) {
      throw new Error(`Failed to download logo: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(OUTPUT_PATH, buffer);
    console.log(`✅ Logo downloaded and saved to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('❌ Error downloading logo:', error);
  }
}

downloadLogo();
