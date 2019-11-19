const express = require("express");
const multer = require("multer");
const router = express.Router()

const ClovaFace = require("./clova_face");
const MsFace = require("./ms_face");
const MsSimilar = require("./ms_similar");
const UploadLocal = require("./upload_local");
const UploadS3 = require("./upload_s3");


router.post("/", async (req, res, next) => {

  let path = null;

  // FormData의 경우 req로 부터 데이터를 얻을수 없다.
  // upload 핸들러(multer)를 통해서 데이터를 읽을 수 있다
  await UploadLocal(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return next(err);
    } else if (err) {
      return next(err);
    }
    console.log("저장된 파일정보 ", req.file);
    console.log("저장파일명 : " + req.file.filename);

    const localPath = `./upload/face/${req.file.filename}`;
    const localImage = {
      "path": localPath,
      "mimetype": req.file.mimetype
    }
    const UploadS3Result = await UploadS3(localImage);
    console.log("UploadS3Result: ", UploadS3Result);
    path = {
      "local": localPath,
      "s3": UploadS3Result.fileInfo.Location
    }
    console.log("path1: ", path);
  });

  console.log("path2: ", path);
  const clovaResult = await ClovaFace(path.local);
  const msFaceResult = await MsFace(path.s3);

  const parsedClova = JSON.parse(clovaResult);
  const parsedFace = JSON.parse(msFaceResult);
  console.log(parsedClova.faces);
  console.log("parsedFace: ", parsedFace);

  const faceId = [];

  const resultData = {
    "cohesion": null,
    "male": {
      "faceCount": null,
      "info": null
    },
    "female": {
      "faceCount": null,
      "info": null
    }
  }

  for (x in parsedFace) {
    const faceAtt = parsedFace[x].faceAttributes;
    faceId.push(parsedFace[x].faceId);
    const gender = faceAtt.gender;
    const faceCount = parsedClova.info.faceCount;
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
      emotion: { 1: emotion[0], 2: emotion[1] },
    }

    if (gender == "male") {
      resultData.male.faceCount = faceCount;
      resultData.male.info = info;
    } else {
      resultData.female.faceCount = faceCount;
      resultData.female.info = info;
    }

  };

  const parsedSimilar = await MsSimilar(faceId);
  const cohesion = parsedSimilar.confidence;
  resultData.cohesion = cohesion;

  console.log(resultData);

  res.json({ result: true, resultData });

});

module.exports = router;