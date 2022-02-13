const { exec } = require("child_process");

module.exports = function mp4ToGif(inputFile = __dirname + '/input.gif', outputFile = __dirname + '/output.gif', callback) {
    console.log('converting mp4 to gif');
    exec(`ffmpeg -i ${inputFile} -f gif ${outputFile} -y`, () => {
        callback(outputFile);
    });

}
