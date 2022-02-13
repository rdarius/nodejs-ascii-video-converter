const { exec } = require("child_process");

module.exports = function makeVideoFromImages(inputFilesPattern = './converted-ss/%d.png', outputFile = __dirname + '/output.mp4', originalFramerate = 10, outputFramerate = 10, callback) {
    console.log('combining images to video');
    exec(`ffmpeg -framerate ${originalFramerate} -i ${inputFilesPattern} -c:v libx264 -r ${outputFramerate} -pix_fmt yuv420p ${outputFile} -y`, () => {
        callback(outputFile);
    });

}
