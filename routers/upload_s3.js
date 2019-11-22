const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const config = require("../common/api_config");


async function uploadS3(localImage) {

    var credentials = new AWS.SharedIniFileCredentials({ profile: 'YJC' });
    AWS.config.credentials = credentials;

    s3 = new AWS.S3({ apiVersion: '2006-03-01' });

    const uploadParams = { Bucket: "face-similar", Key: '', Body: '' };
    const file = localImage.path;

    const fileStream = fs.createReadStream(file);
    fileStream.on('error', function (err) {
        console.log('File Error', err);
    });
    uploadParams.Body = fileStream;
    uploadParams.Key = `face/${path.basename(file)}`;

    let location = new Promise((resolve, reject)=>{
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

module.exports = uploadS3;