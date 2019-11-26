const request = require('request');
const fs = require("fs");
const config = require("../common/api_config");

const client_id = process.env.NAVER_CLIENT_ID || config.naver_client_id;
const client_secret = process.env.NAVER_CLIENT_SECRET || config.naver_client_secret;

async function getClovaFace(filename) {
  const api_url_celebrity = 'https://openapi.naver.com/v1/vision/celebrity'; // 유명인 인식
  //const api_url_face = 'https://openapi.naver.com/v1/vision/face'; // 얼굴 감지

  const _formData = {
    image: 'image',
    image: fs.createReadStream(filename) // FILE 이름
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
        console.log("body ",body);
        resolve(body);
      }
    });
  });

}

module.exports = getClovaFace
