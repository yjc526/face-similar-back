const sharp = require("sharp");

const cutImage = async (filename, faceRectangle) => {
    const original = `upload/face/${filename}`;
    const outputMale = `upload/cut_male/${filename}`;
    const outputFemale = `upload/cut_female/${filename}`;

    await sharp(original).extract({
        width: faceRectangle.male.width + 40,
        height: faceRectangle.male.height + 40,
        left: faceRectangle.male.left - 20,
        top: faceRectangle.male.top - 20
    }).toFile(outputMale)
        .then(function (new_file_info) {
            console.log("Image cropped and saved");
        })
        .catch(function (err) {
            console.log("An error occured : ", err);
        });

    await sharp(original).extract({
        width: faceRectangle.female.width + 20,
        height: faceRectangle.female.height + 20,
        left: faceRectangle.female.left - 10,
        top: faceRectangle.female.top - 10
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