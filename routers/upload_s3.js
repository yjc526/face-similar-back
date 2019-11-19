const AWS = require('aws-sdk');
const fs = require('fs');


async function uploadS3(localImage) {
    const s3 = new AWS.S3({
        accessKeyId: "AKIARW4GNNIAFQ4NMG7N",
        secretAccessKey: "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",
        region: 'ap-northeast-2'
    });

    const param = {
        "Bucket": "face-similar",
        "Key": "face/",
        "ACL": 'public-read-write',
        "Body": fs.createReadStream(localImage.path),
        "ContentType": localImage.mimetype
    }
    let fileInfo = await s3.upload(param);
    console.log(fileInfo);
    return fileInfo;
}

module.exports = uploadS3;