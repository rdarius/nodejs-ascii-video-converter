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

const extractFrames = require('ffmpeg-extract-frames')
const convertToAscii = require('./convertToAscii');
const fs = require('fs');
const { exec } = require("child_process");
const fsExtra = require('fs-extra')

fsExtra.emptyDirSync(__dirname + '/converted-ss')
fsExtra.emptyDirSync(__dirname + '/tmp-ss')

if (!fs.existsSync(__dirname + '/converted-ss')) {
    fs.mkdirSync(__dirname + '/converted-ss');
}
if (!fs.existsSync(__dirname + '/tmp-ss')) {
    fs.mkdirSync(__dirname + '/tmp-ss');
}

const PATH_TO_VIDEO_TO_BE_CONVERTED = __dirname + '/sponge-bob-mrs-puff-scaled.mp4';

async function run() {
    await extractFrames({
        input: PATH_TO_VIDEO_TO_BE_CONVERTED,
        output: __dirname + '/tmp-ss/%d.png'
    });

    let files = fs.readdirSync(__dirname + '/tmp-ss');

    files = files.filter(name => name.endsWith('.png'));

    for (let file of files) {
        await convertToAscii(__dirname + '/tmp-ss/' + file, 12, 0, __dirname + '/converted-ss/' + file);
        fs.rmSync(__dirname + '/tmp-ss/' + file);
    }

    exec('ffmpeg -framerate 10 -i ./converted-ss/%d.png -c:v libx264 -r 30 -pix_fmt yuv420p output.mp4 -y', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

    console.log('done');
}

run();
