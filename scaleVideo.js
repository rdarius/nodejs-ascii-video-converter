const { exec } = require("child_process");

module.exports = function scaleVideo(inputFile = __dirname + '/input.mp4', outputFile = __dirname + '/output.mp4', height = 120, fps = 10, callback) {
    console.log('scaling video');
    exec(`ffmpeg.exe -i ${inputFile} -vf "scale=${height}:-2, fps=${fps} " ${outputFile} -y`, () => {
        callback(outputFile);
    });

}
