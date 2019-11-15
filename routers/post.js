const express = require("express");
const router = express.Router()
const fs = require('fs');

// const ClovaFace = require("./clova_face");
// const MsFace = require("./ms_face");


const request = require('request');


const client_id = '4aCHZGSqgVu3HnBPiX2v';
const client_secret = '2fCj7pjRQs';

async function getClovaFace() {
  const api_url_celebrity = 'https://openapi.naver.com/v1/vision/celebrity'; // 유명인 인식
  //const api_url_face = 'https://openapi.naver.com/v1/vision/face'; // 얼굴 감지

  const _formData = {
    image: 'image',
    image: fs.createReadStream(__dirname + '/c.jpg') // FILE 이름
  };

  const _req = await request.post(
    {
      url: api_url_celebrity, formData: _formData,
      headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
    },
    (error, response, body) => {
      console.log(body);
      return body;
    });
}

const subscriptionKey = 'be2060a408de49fd87fb62d3532f3336';
const uriBase = 'https://koreacentral.api.cognitive.microsoft.com/face/v1.0/detect';

async function getMsFace(imageUrl){
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
    
    const msResult = await request.post(options, (error, response, body) => {
        if (error) {
            console.log('Error: ', error);
            return;
        }
        return body;
    });
}



router.get("/", async (req, res, next) => {
  const imageUrl = 'https://face-similar.s3.ap-northeast-2.amazonaws.com/a.jpg';

  const clovaResult = await getClovaFace();
  const msResult = await getMsFace(imageUrl);
  /*
    const fileURL = await function upload() {
  
      return fileURL;
    }
  */
  console.log(clovaResult);
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  console.log(msResult);
  res.json({ result: true });

});

module.exports = router;