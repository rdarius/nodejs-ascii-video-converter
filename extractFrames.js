const fs = require('fs');
module.exports = async function extractFrames(inputFile = __dirname + '/input.mp4', outputFolder = __dirname + '/tmp-ss', callback) {
    console.log('extracting frames');
    fs.mkdirSync(outputFolder);

    const extractFrames = require('ffmpeg-extract-frames')

    await extractFrames({
        input: inputFile,
        output: outputFolder + '/%d.png',
    });

    callback();
}
