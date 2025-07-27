import { promises as fs } from 'fs';
import fetch from 'node-fetch';
import path from 'path';

const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/website-5a18c.firebasestorage.app/o/DaorsVibes%2FLogo_Transformation_Video_Creation_Guide.mp4?alt=media&token=6843af0a-858e-45f2-b619-83808bb97368';
const OUTPUT_PATH = 'public/logo-transformation-video.mp4';

async function downloadLogo() {
  try {
    const response = await fetch(LOGO_URL);
    if (!response.ok) {
      throw new Error(`Failed to download logo: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(OUTPUT_PATH, buffer);
    console.log(`✅ Video downloaded and saved to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('❌ Error downloading video:', error);
  }
}

downloadLogo();