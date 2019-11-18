const request = require('request');
const fs = require("fs");

const client_id = '4aCHZGSqgVu3HnBPiX2v';
const client_secret = '2fCj7pjRQs';

async function getClovaFace(filename) {
  const api_url_celebrity = 'https://openapi.naver.com/v1/vision/celebrity'; // 유명인 인식
  //const api_url_face = 'https://openapi.naver.com/v1/vision/face'; // 얼굴 감지

  const _formData = {
    image: 'image',
    image: fs.createReadStream(`./upload/face/${filename}`) // FILE 이름
  };
  const options = {
    url: api_url_celebrity, formData: _formData,
    headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
  }

  return new Promise((resolve, reject) => {
    request.post(options, (error, response, body) => {
      if (error) {
        console.log('Error: ', error);
        reject(error);
      } else {
        resolve(body);
      }
    });
  });

}

module.exports = getClovaFace
