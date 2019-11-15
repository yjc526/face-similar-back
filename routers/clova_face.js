const request = require('request');
const fs = require("fs");

const client_id = '4aCHZGSqgVu3HnBPiX2v';
const client_secret = '2fCj7pjRQs';

function getClovaFace() {
  const api_url_celebrity = 'https://openapi.naver.com/v1/vision/celebrity'; // 유명인 인식
  //const api_url_face = 'https://openapi.naver.com/v1/vision/face'; // 얼굴 감지

  const _formData = {
    image: 'image',
    image: fs.createReadStream(__dirname + '/c.jpg') // FILE 이름
  };

  const _req = request.post(
    {
      url: api_url_celebrity, formData: _formData,
      headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
    },
    (error, response, body) => {
      console.log(body);
      return body;
    });
}

