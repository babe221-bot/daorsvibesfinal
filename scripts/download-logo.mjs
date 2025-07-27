import { promises as fs } from 'fs';
import fetch from 'node-fetch';
import path from 'path';

const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/website-5a18c.appspot.com/o/DaorsVibes%2Fgenerated-image%20(7).png?alt=media&token=039ab2f7-1559-4ffc-a706-1bb28ec3a8f8';
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
