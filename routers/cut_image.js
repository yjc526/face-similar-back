const sharp = require("sharp");

const cutImage = async (filename, faceRectangle) => {
    const original = `upload/face/${filename}`;
    const outputMale = `upload/cut_male/${filename}`;
    const outputFemale = `upload/cut_female/${filename}`;

    await sharp(original).extract({
        width: faceRectangle.male.width,
        height: faceRectangle.male.height,
        left: faceRectangle.male.left,
        top: faceRectangle.male.top
    }).toFile(outputMale)
        .then(function (new_file_info) {
            console.log("Image cropped and saved");
        })
        .catch(function (err) {
            console.log("An error occured : ", err);
        });

    await sharp(original).extract({
        width: faceRectangle.female.width,
        height: faceRectangle.female.height,
        left: faceRectangle.female.left,
        top: faceRectangle.female.top
    }).toFile(outputFemale)
        .then(function (new_file_info) {
            console.log("Image cropped and saved");
        })
        .catch(function (err) {
            console.log("An error occured : ", err);
        });

    return { "male": outputMale, "female": outputFemale };
}

module.exports = cutImage;