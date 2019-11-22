'use strict';

const request = require('request');
const path = require('path');
const config = require("../common/api_config");

const subscriptionKey = config.subscriptionKey;
const detectUrl = 'https://koreacentral.api.cognitive.microsoft.com/face/v1.0/detect';

async function getMsFace(s3_path) {
    // Request parameters
    // const params = {
    //     'returnFaceId': 'true',
    //     'returnFaceLandmarks': 'false',
    //     'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
    //         'emotion,hair,makeup,occlusion,accessories,blur,exposure'
    // };
    const params = {
        'returnFaceId': 'true',
        'returnFaceLandmarks': 'false',
        "faceRectangle": "true",
        'returnFaceAttributes': 'age,gender,smile,emotion,hair'
    };

    const options = {
        uri: detectUrl,
        qs: params,
        body: '{"url": ' + '"' + s3_path + '"}',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    };

    return new Promise((resolve, reject) => {
        request.post(options, (error, response, body) => {
            if (error) {
                console.log('Error: ', error);
                reject(error);
            } else {
                const result = JSON.stringify(JSON.parse(body), null, '  ');
                resolve(result);
            }
        });
    });

}

module.exports = getMsFace

