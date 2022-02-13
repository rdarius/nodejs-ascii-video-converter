const { exec } = require("child_process");

module.exports = function extractAudio(inputFile = __dirname + '/input.gif', outputFile = __dirname + '/output.mp4', callback) {
    console.log('extracting audio');
    exec(`ffmpeg -i ${inputFile} ${outputFile} -y`, () => {
        callback(outputFile);
    });

}
