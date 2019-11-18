const express = require("express");
const multer = require("multer");
const router = express.Router()

const ClovaFace = require("./clova_face");
const MsFace = require("./ms_face");
const MsSimilar = require("./ms_similar");
const Upload = require("./upload");


router.get("/", async (req, res, next) => {

  // FormData의 경우 req로 부터 데이터를 얻을수 없다.
  // upload 핸들러(multer)를 통해서 데이터를 읽을 수 있다
  /*
  Upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return next(err);
    } else if (err) {
      return next(err);
    }
    console.log("원본파일명 : " + req.file.originalname);
    console.log("저장파일명 : " + req.file.filename);
    console.log("크기 : " + req.file.size);
    // console.log('경로 : ' + req.file.location) s3 업로드시 업로드 url을 가져옴
    return res.json({ success: 1 });
  });
*/
  const filename = 'd.jpg';

  const clovaResult = await ClovaFace(filename);
  const msFaceResult = await MsFace(filename);

  const parsedClova = JSON.parse(clovaResult);
  const parsedFace = JSON.parse(msFaceResult);
  console.log(parsedFace);


  const faceId = [parsedFace[0].faceId, parsedFace[1].faceId];
  const parsedSimilar = await MsSimilar(faceId);
  // const parsedSimilar = JSON.parse(msSimilarResult);
  // console.log(parsedSimilar);

  /*
    const resultData = {
      cohesion,
      male:{
        faceCount,
        info
      },
      female:{
        faceCount,
        info
      }
    }
  */
  console.log(parsedClova.info, parsedClova.faces);

  const cohesion = parsedSimilar.confidence;
  const faceAtt = parsedFace[0].faceAttributes;
  const faceCount = parsedClova.info.faceCount;
  const gender = faceAtt.gender;
  const age = faceAtt.age;
  const bald = faceAtt.hair.bald;
  const emotion = [];
  for (ele in faceAtt.emotion) {
    emotion.push({ emotion: ele, score: faceAtt.emotion[ele] });
  };
  emotion.sort((a, b) => { // 내림차순
    return a.score > b.score ? -1 : a.score < b.score ? 1 : 0;
  });

  resultData = {
    faceCount,
    cohesion,
    gender,
    age,
    bald,
    emotion: { 1: emotion[0], 2: emotion[1] },
  }

  console.log(resultData);

  res.json({ result: true, resultData });

});

module.exports = router;