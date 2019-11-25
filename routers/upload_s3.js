const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const config = require("../common/api_config");

const credentials = new AWS.SharedIniFileCredentials({ profile: 'YJC' });
AWS.config.credentials = credentials;
s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const uploadParams = { Bucket: "face-similar", Key: '', Body: '' };

async function uploadS3(localImage) {
    const file = localImage.path;

    const fileStream = fs.createReadStream(file);
    fileStream.on('error', function (err) {
        console.log('File Error', err);
    });
    uploadParams.Body = fileStream;
    uploadParams.Key = `face/${path.basename(file)}`;

    let location = new Promise((resolve, reject) => {
        s3.upload(uploadParams, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.Location);
            }
        });
    })
    return location;
}

async function uploadCutImg(filename) {

    const male_file = `./upload/cut_male/${filename}`;
    const female_file = `./upload/cut_female/${filename}`;

    async function cutImg(file, gender) {
        const fileStream = fs.createReadStream(file);
        fileStream.on('error', function (err) {
            console.log('File Error', err);
        });
        uploadParams.Body = fileStream;
        uploadParams.Key = `cut-${gender}/${path.basename(file)}`;

        let location = new Promise((resolve, reject) => {
            s3.upload(uploadParams, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Location);
                }
            });
        });
        return location;
    }
    const location = {
        "male": await cutImg(male_file, "male"),
        "female": await cutImg(female_file, "female")
    }

    return location;
}

module.exports = { uploadS3, uploadCutImg };