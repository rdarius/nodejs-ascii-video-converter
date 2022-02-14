const { promisify } = require("util");
const fs = require("fs");
const convert = require("heic-convert");

module.exports = async function heicToPng(input, output) {
  const inputBuffer = await promisify(fs.readFile)(input);
  const outputBuffer = await convert({
    buffer: inputBuffer,
    format: "PNG",
  });
  await promisify(fs.writeFile)(output, outputBuffer);
};
