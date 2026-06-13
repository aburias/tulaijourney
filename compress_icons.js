const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'public', 'backgrounds');
const TARGET_SIZE = 512; // 512x512 is more than enough for UI icons

const icons = [
  'grade_kinder.png',
  'grade_primary.png',
  'grade_intermediate.png',
  'grade_jhs.png',
  'grade_shs.png'
];

async function compressIcons() {
  for (const filename of icons) {
    const filepath = path.join(inputDir, filename);
    const img = await loadImage(filepath);
    
    console.log(`${filename}: ${img.width}x${img.height} -> ${TARGET_SIZE}x${TARGET_SIZE}`);
    
    const canvas = createCanvas(TARGET_SIZE, TARGET_SIZE);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, TARGET_SIZE, TARGET_SIZE);
    
    const out = fs.createWriteStream(filepath);
    const stream = canvas.createPNGStream();
    
    await new Promise((resolve) => {
      stream.pipe(out);
      out.on('finish', resolve);
    });
    
    const newSize = fs.statSync(filepath).size;
    console.log(`  -> ${(newSize / 1024).toFixed(0)}KB`);
  }
  console.log('Done! All icons compressed.');
}

compressIcons().catch(console.error);
