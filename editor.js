const { spawn } = require("child_process");
module.exports.watermark = async (
  VIDEO_PATH,
  overlayAddress,
  isImage = false
) => {
  try {
    return new Promise(async (resolve, reject) => {
      if (isImage) {
        const child = await spawn(
          "ffmpeg ",
          [
            `-i ./${VIDEO_PATH}`,
            `-i ${__dirname}/${overlayAddress}`,
            `-filter_complex overlay=W-w-10:H-h-10`,
            `./output${VIDEO_PATH}`,
          ],
          { shell: true }
        );
        child.stdout.on("data", (data) => {
          console.log(`stdout: ${data}`);
        });
        child.stderr.on("data", (data) => {
          console.error(`stderr: ${data}`);
        });
        child.on("close", (code) => {
          console.log(`child process exited with code ${code}`);
          resolve("output" + VIDEO_PATH);
        });
      } else {
        const child = await spawn(
          "ffmpeg ",
          [
            `-i ./${VIDEO_PATH}`,
            `-i ${__dirname}/${overlayAddress}`,
            `-filter_complex overlay=W-w-10:H-h-10 -movflags frag_keyframe+empty_moov`,
            `-f mp4 ./output${VIDEO_PATH}`,
          ],
          { shell: true }
        );
        child.stdout.on("data", (data) => {
          console.log(`stdout: ${data}`);
        });
        child.stderr.on("data", (data) => {
          console.error(`stderr: ${data}`);
        });
        child.on("close", (code) => {
          console.log(`child process exited with code ${code}`);
          resolve("output" + VIDEO_PATH);
        });
      }
    });
  } catch (err) {}
};
