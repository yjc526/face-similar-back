'use strict';

const request = require('request');
const path = require('path');

const subscriptionKey = 'be2060a408de49fd87fb62d3532f3336';
const uriBase = 'https://koreacentral.api.cognitive.microsoft.com/face/v1.0/detect';

function getMsFace(imageUrl){
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
        'returnFaceAttributes': 'age,gender,smile,facialHair,emotion,hair'
    };
    
    const options = {
        uri: uriBase,
        qs: params,
        body: '{"url": ' + '"' + imageUrl + '"}',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    };
    
    const msResult = request.post(options, (error, response, body) => {
        if (error) {
            console.log('Error: ', error);
            return;
        }
        const jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
        console.log('JSON jsonResponse\n');
        return jsonResponse;
    });
}

