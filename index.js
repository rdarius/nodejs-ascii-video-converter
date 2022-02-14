/*
PREREQUISITES:
    - ffmpeg installed and added to the PATH

COMMANDS TO PREPARE VIDEO FOR CONVERSION:
    - scale video and lower fps
        ffmpeg.exe -i .\original-video.mp4 -vf "scale=120:-2, fps=30" scaled-video.mp4

COMMANDS TO BUILD VIDEO AFTER CONVERSION:
    - extract audio from video
        ffmpeg -i .\original-video.mp4 extracted-audio.mp3

    - combine video with audio
        ffmpeg -i .\converted-video.mp4 -i extracted-audio.mp3 -c:v copy -c:a aac finished-video.mp4

    - convert video to gif (no audio)
        ffmpeg -i .\converted-video.mp4 -f gif .\converted-video.gif
*/

const convertToAscii = require("./convertToAscii");
const extractFrames = require("./extractFrames");
const gifToMp4 = require("./gifToMp4");
const scaleVideo = require("./scaleVideo");
const fs = require("fs");
const makeVideoFromImages = require("./makeVideoFromImages");
const mp4ToGif = require("./mp4ToGif");
const fsExtra = require("fs-extra");

args = process.argv;

args.shift();
args.shift();

const base = 10;

const randomName = (Math.random() + 1).toString(36).substring(2);

const action = args.shift();

let usage = "";
let example = "";

let input;
let output;
let pixelSize;
let pixelModifier;
let scaledSize;
let fps;

const _scaleVideo = (
  inputFile,
  pixelSize,
  pixelModifier,
  scaledSize,
  fps,
  output,
  convertToGif = false,
  deleteInputFile = false
) => {
  scaleVideo(
    inputFile,
    "mp4-scaled-" + randomName + ".mp4",
    scaledSize,
    fps,
    (scaledFile) => {
      if (deleteInputFile) {
        fs.rmSync(inputFile);
      }
      const outputFolder = __dirname + "/extracted-frames-" + randomName;
      extractFrames(scaledFile, outputFolder, async () => {
        fs.rmSync(scaledFile);
        let files = fs.readdirSync(outputFolder);
        const convertedFolder = __dirname + "/converted-frames-" + randomName;
        let index = 0;
        for (let file of files) {
          index++;
          await convertToAscii(
            outputFolder + "/" + file,
            convertedFolder + "/" + file,
            pixelSize,
            pixelModifier,
            scaledSize,
            () => {
              console.log(index, "/", files.length);
              fs.rmSync(outputFolder + "/" + file);
            }
          );
        }
        fsExtra.emptyDirSync(outputFolder);
        fs.rmdirSync(outputFolder);
        makeVideoFromImages(
          convertedFolder + "/%d.png",
          __dirname + "generated-video-" + randomName + ".mp4",
          fps,
          fps,
          (generatedVideoFIle) => {
            fsExtra.emptyDirSync(convertedFolder);
            fs.rmdirSync(convertedFolder);
            if (convertToGif) {
              mp4ToGif(generatedVideoFIle, output, (gif) => {
                console.log("gif generated in: " + gif);
              });
            } else {
              fs.renameSync(generatedVideoFIle, output);
              console.log("video generated in: " + output);
            }
          }
        );
      });
    }
  );
};

switch (action) {
  case "img":
    usage = `Usage: npm run convert:img input-image-path.png[optional, default:./input.png] output-image-path.png[optional, default:./output.png] pixel-size[optional, default:24] font-size-modifier[optional, degault:4]`;
    example = `Example: npm run convert:img input.png output.png 24 0`;

    if (args[0] === "help") {
      console.log(`${usage}\n${example}`);
      process.exit(0);
    }

    if (args.length > 5) {
      console.error(`Invalid parameter count!\n${usage}\n${example}`);
      process.exit(0);
    }

    if (args[2] && isNaN(parseInt(args[2], base))) {
      console.error(`Pixel size must be a number!\n${usage}\n${example}`);
      process.exit(0);
    }

    if (args[3] && isNaN(parseInt(args[3], base))) {
      console.error(
        `Font size modifier must be a number!\n${usage}\n${example}`
      );
      process.exit(0);
    }

    if (args[4] && isNaN(parseInt(args[4], base))) {
      console.error(`Scaled size must be a number!\n${usage}\n${example}`);
      process.exit(0);
    }

    input = args[0];
    output = args[1];
    pixelSize = parseInt(args[2], base);
    pixelModifier = parseInt(args[3], base);
    scaledSize = parseInt(args[4], base);

    convertToAscii(input, output, pixelSize, pixelModifier, scaledSize, () => {
      console.log(`Image converted and saved in ${args[1]}`);
    });

    break;
  case "gif:gif":
    usage = `Usage: npm run convert:gif:gif input-image-path.png[optional, default:./input.gif] output-image-path.png[optional, default:./output.gif] pixel-size[optional, default:24] font-size-modifier[optional, degault:4] scaled-size[optional, default=120] fps[optional, default=10]`;
    example = `Example: npm run convert:gif:gif input.gif output.gif 24 4 120 10`;

    if (args[0] === "help") {
      console.log(`${usage}\n${example}`);
      process.exit(0);
    }

    if (args.length > 7) {
      console.error(`Invalid parameter count!\n${usage}\n${example}`);
      process.exit(0);
    }

    if (args[2] && isNaN(parseInt(args[2], base))) {
      console.error(`Pixel size must be a number!\n${usage}\n${example}`);
      process.exit(0);
    }

    if (args[3] && isNaN(parseInt(args[3], base))) {
      console.error(
        `Font size modifier must be a number!\n${usage}\n${example}`
      );
      process.exit(0);
    }

    if (args[4] && isNaN(parseInt(args[4], base))) {
      console.error(`Scaled size must be a number!\n${usage}\n${example}`);
      process.exit(0);
    }

    if (args[5] && isNaN(parseInt(args[5], base))) {
      console.error(`Original FPS must be a number!\n${usage}\n${example}`);
      process.exit(0);
    }

    input = args[0];
    output = args[1];
    pixelSize = parseInt(args[2], base);
    pixelModifier = parseInt(args[3], base);
    scaledSize = parseInt(args[4], base);
    fps = parseInt(args[5], base);

    gifToMp4(input, "gif-to-mp4-" + randomName + ".mp4", (convertedFile) => {
      _scaleVideo(
        convertedFile,
        pixelSize,
        pixelModifier,
        scaledSize,
        fps,
        output,
        true,
        true
      );
    });

    break;
  case "gif:mp4":
    usage = `Usage: npm run convert:gif:mp4 input-image-path.gif[optional, default:./input.gif] output-image-path.mp4[optional, default:./output.mp4] pixel-size[optional, default:24] font-size-modifier[optional, degault:4] scaled-size[optional, default=120] fps[optional, default=10]`;
    example = `Example: npm run convert:gif:mp4 input.gif output.mp4 24 4 120 10`;

    if (args[0] === "help") {
      console.log(`${usage}\n${example}`);
      process.exit(0);
    }

    if (args.length > 7) {
      console.error(`Invalid parameter count!\n${usage}\n${example}`);
      process.exit(0);
    }

    if (args[2] && isNaN(parseInt(args[2], base))) {
      console.error(`Pixel size must be a number!\n${usage}\n${example}`);
      process.exit(0);
    }

    if (args[3] && isNaN(parseInt(args[3], base))) {
      console.error(
        `Font size modifier must be a number!\n${usage}\n${example}`
      );
      process.exit(0);
    }

    if (args[4] && isNaN(parseInt(args[4], base))) {
      console.error(`Scaled size must be a number!\n${usage}\n${example}`);
      process.exit(0);
    }

    if (args[5] && isNaN(parseInt(args[5], base))) {
      console.error(`Original FPS must be a number!\n${usage}\n${example}`);
      process.exit(0);
    }

    input = args[0];
    output = args[1];
    pixelSize = parseInt(args[2], base);
    pixelModifier = parseInt(args[3], base);
    scaledSize = parseInt(args[4], base);
    fps = parseInt(args[5], base);

    gifToMp4(input, "gif-to-mp4-" + randomName + ".mp4", (convertedFile) => {
      _scaleVideo(
        convertedFile,
        pixelSize,
        pixelModifier,
        scaledSize,
        fps,
        output,
        false,
        true
      );
    });

    break;
  case "mp4:gif":
    usage = `Usage: npm run convert:mp4:gif input-image-path.mp4[optional, default:./input.mp4] output-image-path.gif[optional, default:./output.gif] pixel-size[optional, default:24] font-size-modifier[optional, degault:4] scaled-size[optional, default=120] fps[optional, default=10]`;
    example = `Example: npm run convert:mp4:gif input.mp4 output.gif 24 4 120 10`;

    if (args[0] === "help") {
      console.log(`${usage}\n${example}`);
      process.exit(0);
    }

    if (args.length > 7) {
      console.error(`Invalid parameter count!\n${usage}\n${example}`);
      process.exit(0);
    }

    if (args[2] && isNaN(parseInt(args[2], base))) {
      console.error(`Pixel size must be a number!\n${usage}\n${example}`);
      process.exit(0);
    }

    if (args[3] && isNaN(parseInt(args[3], base))) {
      console.error(
        `Font size modifier must be a number!\n${usage}\n${example}`
      );
      process.exit(0);
    }

    if (args[4] && isNaN(parseInt(args[4], base))) {
      console.error(`Scaled size must be a number!\n${usage}\n${example}`);
      process.exit(0);
    }

    if (args[5] && isNaN(parseInt(args[5], base))) {
      console.error(`Original FPS must be a number!\n${usage}\n${example}`);
      process.exit(0);
    }

    input = args[0];
    output = args[1];
    pixelSize = parseInt(args[2], base);
    pixelModifier = parseInt(args[3], base);
    scaledSize = parseInt(args[4], base);
    fps = parseInt(args[5], base);

    _scaleVideo(
      input,
      pixelSize,
      pixelModifier,
      scaledSize,
      fps,
      output,
      true,
      false
    );

    break;
  case "mp4:mp4":
    usage = `Usage: npm run convert:mp4:mp4 input-image-path.mp4[optional, default:./input.mp4] output-image-path.mp4[optional, default:./output.mp4] pixel-size[optional, default:24] font-size-modifier[optional, degault:4] scaled-size[optional, default=120] fps[optional, default=10]`;
    example = `Example: npm run convert:mp4:mp4 input.mp4 output.mp4 24 4 120 10`;

    if (args[0] === "help") {
      console.log(`${usage}\n${example}`);
      process.exit(0);
    }

    if (args.length > 7) {
      console.error(`Invalid parameter count!\n${usage}\n${example}`);
      process.exit(0);
    }

    if (args[2] && isNaN(parseInt(args[2], base))) {
      console.error(`Pixel size must be a number!\n${usage}\n${example}`);
      process.exit(0);
    }

    if (args[3] && isNaN(parseInt(args[3], base))) {
      console.error(
        `Font size modifier must be a number!\n${usage}\n${example}`
      );
      process.exit(0);
    }

    if (args[4] && isNaN(parseInt(args[4], base))) {
      console.error(`Scaled size must be a number!\n${usage}\n${example}`);
      process.exit(0);
    }

    if (args[5] && isNaN(parseInt(args[5], base))) {
      console.error(`Original FPS must be a number!\n${usage}\n${example}`);
      process.exit(0);
    }

    input = args[0];
    output = args[1];
    pixelSize = parseInt(args[2], base);
    pixelModifier = parseInt(args[3], base);
    scaledSize = parseInt(args[4], base);
    fps = parseInt(args[5], base);

    _scaleVideo(
      input,
      pixelSize,
      pixelModifier,
      scaledSize,
      fps,
      output,
      false,
      false
    );

    break;

  default:
    console.log(`Available commands:
convert:gif:gif - converts regular gif to ascii gif
convert:gif:mp4 - converts regular gif to ascii mp4
convert:mp4:mp4 - converts regular mp4 to ascii mp4
convert:mp4:gif - converts regular mp4 to ascii gif
convert:img - converts regular image to ascii image\n`);
}
