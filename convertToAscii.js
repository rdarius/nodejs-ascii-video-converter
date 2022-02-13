module.exports = convertToAscii = async (file, dotSize = 24, verticalSpacinModifier = 4, output = __dirname + '/tmp.img.png') => {
    const hobbitImageFile = file;
    const density = 'Ñ@#W$9876543210?!abc;:+=-,._ ';

    const { createCanvas } = require('canvas')
    const ImageDataURI = require('image-data-uri');
    var sizeOf = require('image-size');
    var dimensions = sizeOf(hobbitImageFile);

    const hobbit = {
        width: dimensions.width,
        height: dimensions.height,
        pixels: [],
    }

    function clamp(input, min, max) {
        return input < min ? min : input > max ? max : input;
    }

    function map(current, in_min, in_max, out_min, out_max) {
        const mapped = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
        return clamp(mapped, out_min, out_max);
    }

    await new Promise((res, rej) => {
        var PNG = require('png-js');
        PNG.decode(hobbitImageFile, function(pixels) {

            const canvas = createCanvas(hobbit.width * dotSize, hobbit.height * dotSize);
            const ctx = canvas.getContext('2d')

            hobbit.pixels = pixels;

            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, hobbit.width * dotSize, hobbit.height * dotSize);

            for(let x = 0; x < hobbit.width; x++) {
                for(let y = 0; y < hobbit.height; y++) {
                    const pixelPosition = (x + y*hobbit.width)*4;
                    const r = hobbit.pixels[pixelPosition + 0];
                    const g = hobbit.pixels[pixelPosition + 1];
                    const b = hobbit.pixels[pixelPosition + 2];
                    const a = hobbit.pixels[pixelPosition + 3];
                    
                    const avg = Math.floor((r+g+b)/ 3);

                    const gray = map(255 - avg, 0, 255, 0, density.length);
                    
                    ctx.font = (dotSize + verticalSpacinModifier) + "px Courier";
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = `white`;
                    ctx.fillText(density.charAt(gray), x*dotSize + dotSize/2, y*dotSize + dotSize/2);
                }
            }
            
            ImageDataURI.outputFile(canvas.toDataURL(), output);
            console.log(output, 'converted');
            res(1);
        });

    });
}
