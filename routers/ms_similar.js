'use strict';

const request = require('request');

const subscriptionKey = 'be2060a408de49fd87fb62d3532f3336';
const similarUrl = 'https://koreacentral.api.cognitive.microsoft.com/face/v1.0/verify';

async function getMsSimilar(faceId) {
    console.log(faceId[0], faceId[1]);
    const params = {
        "faceId1": faceId[0],
        "faceId2": faceId[1]
    };
    const options = {
        uri: similarUrl,
        body: params,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    };

    return new Promise((resolve, reject) => {
        request.post(options, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                console.log("body: ",body);
                // const similar = JSON.parse(body)
                resolve(body);
            }
        });
    });
}

module.exports = getMsSimilar
