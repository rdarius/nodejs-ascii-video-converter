const { exec } = require("child_process");

module.exports = function addAudio(inputVideoFile = __dirname + '/input.mp4', inputAudioFile = __dirname + '/input.mp3', outputFile = __dirname + '/output.mp4', callback) {
    console.log('adding audio to video file');
    exec(`ffmpeg -i ${inputVideoFile} -i ${inputAudioFile} -c:v copy -c:a aac ${outputFile} -y`, () => {
        callback(outputFile);
    });

}
