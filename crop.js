const { Jimp } = require("jimp");

async function processImage(filename) {
    try {
        console.log(`Processing ${filename}...`);
        const image = await Jimp.read(filename);
        
        // Remove white background (make it transparent)
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            // If it's very close to white (allow some tolerance for AI artifacts)
            if (r > 230 && g > 230 && b > 230) {
                this.bitmap.data[idx + 3] = 0; // Set Alpha to 0 (transparent)
            }
        });

        // Remove autocrop to preserve the original grid spacing!
        // image.autocrop();
        
        const outName = filename.replace('.png', '_cropped.png');
        await image.write(outName);
        console.log(`Successfully cropped and saved to ${outName}`);
    } catch (e) {
        console.error(`Failed to process ${filename}:`, e);
    }
}

async function main() {
    await processImage('kinder_walk.png');
    await processImage('kinder_idle.png');
}
main();
