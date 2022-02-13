const { exec } = require("child_process");

module.exports = function gifToMp4(inputFile = __dirname + '/input.gif', outputFile = __dirname + '/output.gif', callback) {
    console.log('converting gif to mp4');
    exec(`ffmpeg -i ${inputFile} ${outputFile} -y`, () => {
        callback(outputFile);
    });

}
