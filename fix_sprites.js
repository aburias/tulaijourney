const { Jimp } = require("jimp");

async function fixSpriteSheet(filename, cols, rows, outName) {
    console.log(`Fixing ${filename}...`);
    try {
        const image = await Jimp.read(filename);
        
        // 1. Remove white background
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            if (r > 230 && g > 230 && b > 230) {
                this.bitmap.data[idx + 3] = 0; 
            }
        });

        const cellW = Math.floor(image.bitmap.width / cols);
        const cellH = Math.floor(image.bitmap.height / rows);
        
        // We want the final frames to be uniform 200x200
        const finalFrameW = 200;
        const finalFrameH = 200;
        
        // Create new blank transparent image
        const newImage = new Jimp({ width: cols * finalFrameW, height: rows * finalFrameH, color: 0x00000000 });
        
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // Extract the rough cell from the AI grid
                const cell = image.clone().crop({ x: c * cellW, y: r * cellH, w: cellW, h: cellH });
                
                // Autocrop the cell to isolate the exact bounding box of the character
                cell.autocrop();
                
                // Calculate position to draw in the new uniform grid
                // Center horizontally, and bottom-align vertically so feet touch the floor perfectly
                const xOffset = Math.floor((finalFrameW - cell.bitmap.width) / 2);
                const yOffset = finalFrameH - cell.bitmap.height - 20; // 20px padding from bottom
                
                // Draw character into the perfectly aligned new grid
                newImage.composite(cell, c * finalFrameW + xOffset, r * finalFrameH + yOffset);
            }
        }
        
        await newImage.write(outName);
        console.log(`Saved perfectly aligned sprite to ${outName}`);
    } catch (e) {
        console.error(`Failed on ${filename}`, e);
    }
}

async function main() {
    await fixSpriteSheet('kinder_walk.png', 6, 7, 'public/kinder_walk_cropped.png');
    await fixSpriteSheet('kinder_idle.png', 4, 1, 'public/kinder_idle_cropped.png');
}
main();
