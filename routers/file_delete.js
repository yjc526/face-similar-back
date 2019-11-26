const fs = require("fs");

function unlink(path) {
    fs.unlink(path, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('file deleted : ', path);;
        }
    });
}

module.exports = function fileDelete(filename) {
    unlink(`upload/face/${filename}`);
    unlink(`upload/cut_female/${filename}`);
    unlink(`upload/cut_male/${filename}`);
}