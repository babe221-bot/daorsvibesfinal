
import { promises as fs } from 'fs';
import fetch from 'node-fetch';
import path from 'path';

const BUCKET = 'website-5a18c.appspot.com';
const OBJECT_PATH = 'DaorsVibes/generated-image (8).png';
const TOKEN = '9cf04eea-e4ca-4000-840a-df41406f6a6a';

const LOGO_URL = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(OBJECT_PATH)}?alt=media&token=${TOKEN}`;
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
