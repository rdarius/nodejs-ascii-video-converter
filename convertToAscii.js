const { createCanvas } = require("canvas");
const ImageDataURI = require("image-data-uri");
var sizeOf = require("image-size");
const { exec, execSync } = require("child_process");
const heicToPng = require("./heicToPng");

module.exports = convertToAscii = async (
  file = __dirname + "input.png",
  output = __dirname + "/output.png",
  dotSize = 24,
  verticalSpacingModifier = 4,
  scaledSize = 120,
  callback
) => {
  const filePNG = file + (file.toLowerCase().endsWith(".png") ? "" : ".png");
  let fileToConvert = file;
  if (
    file.toLowerCase().endsWith(".heic") ||
    file.toLowerCase().endsWith(".heif")
  ) {
    console.log("heic file got");
    await heicToPng(file, filePNG);
    fileToConvert = filePNG;
  }
  console.log("pre image resize");
  const scaledFile = "scaled-" + filePNG;
  execSync(
    `ffmpeg -i ${fileToConvert} -vf scale=${scaledSize}:-2 ${scaledFile} -y`
  );
  console.log("post image scale");

  await convert(scaledFile, output, dotSize, verticalSpacingModifier);
  callback(output);
};

const convert = async (file, output, dotSize, verticalSpacingModifier) => {
  const density = "Ñ@#W$9876543210?!abc;:+=-,._ ";
  var dimensions = sizeOf(file);

  const image = {
    width: dimensions.width,
    height: dimensions.height,
    pixels: [],
  };

  function clamp(input, min, max) {
    return input < min ? min : input > max ? max : input;
  }

  function map(current, in_min, in_max, out_min, out_max) {
    const mapped =
      ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
    return clamp(mapped, out_min, out_max);
  }

  await new Promise((res, rej) => {
    var PNG = require("png-js");
    PNG.decode(file, function (pixels) {
      const canvas = createCanvas(
        image.width * dotSize,
        image.height * dotSize
      );
      const ctx = canvas.getContext("2d");

      image.pixels = pixels;

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, image.width * dotSize, image.height * dotSize);

      ctx.font = dotSize + verticalSpacingModifier + "px Courier";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = `white`;

      for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
          const pixelPosition = (x + y * image.width) * 4;
          const r = image.pixels[pixelPosition + 0];
          const g = image.pixels[pixelPosition + 1];
          const b = image.pixels[pixelPosition + 2];
          const a = image.pixels[pixelPosition + 3];

          const avg = Math.floor((r + g + b) / 3) * (a / 255);

          const gray = map(255 - avg, 0, 255, 0, density.length);
          ctx.fillText(
            density.charAt(gray),
            x * dotSize + dotSize / 2,
            y * dotSize + dotSize / 2
          );
        }
      }

      ImageDataURI.outputFile(canvas.toDataURL(), output);
      res(1);
    });
  });
};
