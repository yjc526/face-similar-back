const express = require("express");
const router = express.Router()

const ClovaFace = require("./clova_face");
const MsFace = require("./ms_face");


router.get("/", async (req, res, next) => {
  const imageUrl = 'https://face-similar.s3.ap-northeast-2.amazonaws.com/a.jpg';

  const clovaResult = await ClovaFace();
  const msResult = await MsFace(imageUrl);

  // console.log("clovaResult  ", clovaResult);
  // console.log("msResult  ", msResult);

  const parsedClova = JSON.parse(clovaResult);
  const parsedMs = JSON.parse(msResult);
/*
  const resultData = {
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

  const faceAtt = parsedMs[0].faceAttributes;
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
    gender,
    age,
    bald,
    emotion: { 1: emotion[0], 2: emotion[1] },
  }

  console.log(resultData);

  res.json({ result: true, resultData });

});

module.exports = router;