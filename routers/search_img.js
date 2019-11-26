const request = require('request')

const config = require("../common/api_config");

async function searchImage(name) {
    const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID || config.naver_client_id;
    const NAVER_CLIENT_SECRET =  process.env.NAVER_CLIENT_SECRET || config.naver_client_secret;
    const option = {
        query: `${name}`, //이미지 검색 텍스트
        start: 1, //검색 시작 위치
        display: 10, //가져올 이미지 갯수
        sort: 'sim', //정렬 유형 (sim:유사도)
        filter: 'all' //이미지 사이즈
    }

    let result = null;

    return new Promise((resolve, reject) => {
        request.get({
            uri: 'https://openapi.naver.com/v1/search/image',
            qs: option,
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
            }
        }, (err, res, body) => {
            if (err) {
                console.log('Error: ', err);
                reject(err);
            } else {
                result = JSON.parse(body).items[0];
                if(result){
                    console.log(result);
                    resolve(result.link);
                }else{
                    resolve(null);
                }
            }
        })
    });
}

module.exports = searchImage;


