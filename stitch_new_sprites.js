const { Jimp } = require('jimp');
const path = require('path');

const inputDir = path.join(__dirname, 'public', 'sprites');
const outputFile = path.join(__dirname, 'public', 'master_male_walk_25frames.png');

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
  
  const upImg = await Jimp.read(path.join(inputDir, files.up));
  const downImg = await Jimp.read(path.join(inputDir, files.down));
  const rightImg = await Jimp.read(path.join(inputDir, files.right));
  const upRightImg = await Jimp.read(path.join(inputDir, files.upRight));
  const downRightImg = await Jimp.read(path.join(inputDir, files.downRight));

  // The master sheet will be 25 frames wide, 8 rows tall.
  const masterWidth = TOTAL_FRAMES * FRAME_SIZE;
  const masterHeight = 8 * FRAME_SIZE;
  
  const masterSheet = new Jimp(masterWidth, masterHeight, 0x00000000); // Transparent

  // Helper to extract frames from a 5x5 grid and put them in a row
  function copyRowToMaster(sourceImg, rowIdx, flipHorizontal = false) {
    for (let f = 0; f < TOTAL_FRAMES; f++) {
      const srcCol = f % FRAMES_X;
      const srcRow = Math.floor(f / FRAMES_X);
      
      const frame = sourceImg.clone();
      frame.crop(srcCol * FRAME_SIZE, srcRow * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE);
      
      if (flipHorizontal) {
        frame.flip(true, false);
      }
      
      masterSheet.blit(frame, f * FRAME_SIZE, rowIdx * FRAME_SIZE);
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
  await masterSheet.writeAsync(outputFile);
  console.log('Done!');
}

processSprites().catch(console.error);
