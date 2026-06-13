const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'public', 'sprites');
const outputFile = path.join(__dirname, 'public', 'sprites', 'master_male_walk_25frames.png');

const FRAME_SIZE = 256;
const FRAMES_X = 5;
const FRAMES_Y = 5;
const TOTAL_FRAMES = 25;

const files = {
  up: 'Bayani Male Kinder-iso_walk_up-v1.png',
  down: 'Bayani Male Kinder-iso_walk_down-v1.png',
  right: 'Bayani Male Kinder-iso_walk_right-v1.png',
  upRight: 'Bayani Male Kinder-iso_walk_northeast-v3.png',
  downRight: 'Bayani Male Kinder-iso_walk_southeast-v1.png',
};

// Row map based on SpriteCharacter.jsx
const rowMap = {
  'up': 0,        
  'down': 1,      
  'left': 2,      
  'right': 3,     
  'up-right': 4,  
  'up-left': 5,   
  'down-left': 6, 
  'down-right': 7 
};

async function processSprites() {
  console.log('Loading raw sprite sheets...');
  
  const [upImg, downImg, rightImg, upRightImg, downRightImg] = await Promise.all([
    loadImage(path.join(inputDir, files.up)),
    loadImage(path.join(inputDir, files.down)),
    loadImage(path.join(inputDir, files.right)),
    loadImage(path.join(inputDir, files.upRight)),
    loadImage(path.join(inputDir, files.downRight)),
  ]);

  // Master sheet: 25 frames wide, 8 rows tall.
  const masterWidth = TOTAL_FRAMES * FRAME_SIZE;
  const masterHeight = 8 * FRAME_SIZE;
  
  const canvas = createCanvas(masterWidth, masterHeight);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, masterWidth, masterHeight); // Transparent bg

  // Helper to extract frames from a 5x5 grid and put them in a row
  function copyRowToMaster(sourceImg, rowIdx, flipHorizontal = false) {
    for (let f = 0; f < TOTAL_FRAMES; f++) {
      const srcCol = f % FRAMES_X;
      const srcRow = Math.floor(f / FRAMES_X);
      
      const destX = f * FRAME_SIZE;
      const destY = rowIdx * FRAME_SIZE;

      ctx.save();
      
      if (flipHorizontal) {
        // Translate to the destination, flip horizontally
        ctx.translate(destX + FRAME_SIZE, destY);
        ctx.scale(-1, 1);
        ctx.drawImage(
          sourceImg,
          srcCol * FRAME_SIZE, srcRow * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE,
          0, 0, FRAME_SIZE, FRAME_SIZE
        );
      } else {
        ctx.drawImage(
          sourceImg,
          srcCol * FRAME_SIZE, srcRow * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE,
          destX, destY, FRAME_SIZE, FRAME_SIZE
        );
      }
      
      ctx.restore();
    }
    console.log(`Finished processing row ${rowIdx}`);
  }

  // 1. Up
  copyRowToMaster(upImg, rowMap['up']);
  
  // 2. Down
  copyRowToMaster(downImg, rowMap['down']);
  
  // 3. Right
  copyRowToMaster(rightImg, rowMap['right']);
  
  // 4. Left (Flipped Right)
  copyRowToMaster(rightImg, rowMap['left'], true);
  
  // 5. Up-Right (Northeast)
  copyRowToMaster(upRightImg, rowMap['up-right']);
  
  // 6. Up-Left (Northwest) -> Flipped Up-Right
  copyRowToMaster(upRightImg, rowMap['up-left'], true);
  
  // 7. Down-Right (Southeast)
  copyRowToMaster(downRightImg, rowMap['down-right']);
  
  // 8. Down-Left (Southwest) -> Flipped Down-Right
  copyRowToMaster(downRightImg, rowMap['down-left'], true);

  console.log('Writing master sprite sheet to:', outputFile);
  const out = fs.createWriteStream(outputFile);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  
  out.on('finish', () => console.log('Done! Master sprite created successfully.'));
}

processSprites().catch(console.error);
