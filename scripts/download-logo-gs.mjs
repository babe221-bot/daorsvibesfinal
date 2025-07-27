import { promises as fs } from 'fs';
import fetch from 'node-fetch';
import path from 'path';

const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/website-5a18c.appspot.com/o/DaorsVibes%2FLogo_Transformation_Video_Creation_Guide.mp4?alt=media&token=6843af0a-858e-45f2-b619-83808bb97368';
const OUTPUT_PATH = 'public/Logo_Transformation_Video_Creation_Guide.mp4';

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
