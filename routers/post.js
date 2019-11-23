const express = require("express");
const multer = require("multer");
const router = express.Router()

const ClovaFace = require("./clova_face");
const MsFace = require("./ms_face");
const MsSimilar = require("./ms_similar");
const UploadLocal = require("./upload_local");
const UploadS3 = require("./upload_s3");
const CalcScore = require("./calc_score");
const CutImage = require("./cut_image");
const Rank = require("./rank");


router.post("/", async (req, res, next) => {

  // FormData의 경우 req로 부터 데이터를 얻을수 없다.
  // upload 핸들러(multer)를 통해서 데이터를 읽을 수 있다
  const pathObj = new Promise((resolve, reject) => {
    UploadLocal(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        reject(err);
      } else if (err) {
        reject(err);
      } else {
        const localPath = `./upload/face/${req.file.filename}`;
        const localImage = {
          "path": localPath,
          "mimetype": req.file.mimetype
        }

        const UploadS3Result = await UploadS3(localImage);
        obj = {
          "filename": req.file.filename,
          "local": localPath,
          "s3": UploadS3Result
        }
      }
      resolve(obj);
    });
  })
  const path = await pathObj;

  const msFaceResult = await MsFace(path.s3);
  const parsedFace = JSON.parse(msFaceResult);

  const faceId = [];
  const faceRectangle = {
    "male": null,
    "female": null
  };

  const result = {
    "score": null,  // 점수 (잘어울리는, 남자, 여자)
    "rank": null,
    "cohesion": null, // 비슷한 수치
    "male": { // 남자 얼굴 정보
      "faceCount": null,
      "info": null
    },
    "female": { // 여자 얼굴 정보 
      "faceCount": null,
      "info": null
    }
  }

  for (x in parsedFace) {
    const faceAtt = parsedFace[x].faceAttributes;
    faceId.push(parsedFace[x].faceId);
    const gender = faceAtt.gender;
    const age = faceAtt.age;
    const bald = faceAtt.hair.bald;
    const smile = faceAtt.smile;
    const emotion = [];
    for (ele in faceAtt.emotion) {
      emotion.push({ emotion: ele, score: faceAtt.emotion[ele] });
    };
    emotion.sort((a, b) => { // 내림차순
      return a.score > b.score ? -1 : a.score < b.score ? 1 : 0;
    });

    const info = {
      gender,
      age,
      bald,
      smile,
      emotion: { "first": emotion[0], "second": emotion[1] },
    }

    if (gender == "male") {
      faceRectangle.male = parsedFace[x].faceRectangle;
      result.male.info = info;
    } else {
      faceRectangle.female = parsedFace[x].faceRectangle;
      result.female.info = info;
    }
  };

  const cutImagePath = await CutImage(path.filename, faceRectangle);

  const clovaMaleResult = await ClovaFace(cutImagePath.male);
  const parsedMaleClova = JSON.parse(clovaMaleResult);

  const clovaFemaleResult = await ClovaFace(cutImagePath.female);
  const parsedFemaleClova = JSON.parse(clovaFemaleResult);

  result.male.faceCount = parsedMaleClova.info.faceCount;
  result.female.faceCount = parsedFemaleClova.info.faceCount;
  console.log("parsedMaleClova: ", parsedMaleClova.faces);
  console.log("parsedFemaleClova : ", parsedFemaleClova.faces);

  const parsedSimilar = await MsSimilar(faceId);
  result.cohesion = parsedSimilar.confidence;

  result.score = CalcScore(result);
  result.rank = Rank(result);

  console.log(result);

  res.json({ status: true, result: result });
});

module.exports = router;