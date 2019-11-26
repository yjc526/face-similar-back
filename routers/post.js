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
const SearchImage = require("./search_img");
const FileDelete = require("./file_delete");


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

        const UploadS3Result = await UploadS3.uploadS3(localImage);
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

  // 얼굴 감지에 따른 에러 처리
  const err_msg = { status: false, result: { "err": null, "msg": null } }
  if (parsedFace.length < 2) {
    if (parsedFace.length == 0) {
      console.log("Any Face Not Detected");
      err_msg.result.err = "any";
      err_msg.result.msg = "어떠한 얼굴도 감지되지 않았습니다.\n남여 둘 다 얼굴이 나온 사진을 올려주세요.";
    } else if (parsedFace[0].faceAttributes.gender == "female") {
      console.log("Male Face Not Detected");
      err_msg.result.err = "male";
      err_msg.result.msg = "남성 얼굴이 감지되지 않았습니다.\n남여 둘 다 얼굴이 나온 사진을 올려주세요.";
    } else {
      console.log("Female Face Not Detected");
      err_msg.result.err = "female";
      err_msg.result.msg = "여성 얼굴이 감지되지 않았습니다.\n남여 둘 다 얼굴이 나온 사진을 올려주세요.";
    }
    res.json(err_msg);
  } else if (parsedFace.length > 2) {
    console.log("Too Many Face Detected");
    err_msg.result.err = "too";
    err_msg.result.msg = "3명 이상의 얼굴이 감지되었습니다.\n남여 두 명만 나온 사진을 올려주세요.";
    res.json(err_msg);
  } else {

    const faceId = [];
    const faceRectangle = {
      "male": null,
      "female": null
    };

    const result = {
      "score": null,  // 점수 (잘어울리는, 남자, 여자)
      "rank": null,
      "face_url": null,
      "cohesion": null, // 비슷한 수치
      "info": {
        "male": null,
        "female": null
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
        faceCount: null,
        celebrity: {
          "name": null,
          "url": null,
        },
        gender,
        age,
        bald,
        smile,
        emotion: { "first": emotion[0], "second": emotion[1] },
      }

      if (gender == "male") {
        faceRectangle.male = parsedFace[x].faceRectangle;
        result.info.male = info;
      } else {
        faceRectangle.female = parsedFace[x].faceRectangle;
        result.info.female = info;
      }
    };

    // 2명이 감지되었지만 동성끼리 찍은 사진이 들어올 때 에러처리
    if (!result.info.male) {
      console.log("Male Face Not Detected");
      err_msg.result.err = "male";
      err_msg.result.msg = "남성 얼굴이 감지되지 않았습니다.\n남여 둘 다 얼굴이 나온 사진을 올려주세요.";
      res.json(err_msg);
    } else if (!result.info.female) {
      console.log("Female Face Not Detected");
      err_msg.result.err = "female";
      err_msg.result.msg = "여성 얼굴이 감지되지 않았습니다.\n남여 둘 다 얼굴이 나온 사진을 올려주세요.";
      res.json(err_msg);
    } else {
      const cutImagePath = await CutImage(path.filename, faceRectangle);

      result.face_url = await UploadS3.uploadCutImg(req.file.filename);

      const clovaMaleResult = await ClovaFace(cutImagePath.male);
      const parsedMaleClova = JSON.parse(clovaMaleResult);

      const clovaFemaleResult = await ClovaFace(cutImagePath.female);
      const parsedFemaleClova = JSON.parse(clovaFemaleResult);

      //Clova Face API결과 - 닮은 유명인 수 
      result.info.male.faceCount = parsedMaleClova.info.faceCount;
      result.info.female.faceCount = parsedFemaleClova.info.faceCount;

      //Clova Face API결과 - 유명인 정보 
      //naver search API 결과 - 유명인 이름으로 네이버에서 이미지 검색 후 이미지 URL 리턴
      if (parsedMaleClova.faces[0]) {
        result.info.male.celebrity.name = parsedMaleClova.faces[0].celebrity.value;
        console.log(" result.info.male.celebrity.name ", result.info.male.celebrity.name)
        result.info.male.celebrity.url = await SearchImage(result.info.male.celebrity.name);
      }

      if (parsedFemaleClova.faces[0]) {
        result.info.female.celebrity.name = parsedFemaleClova.faces[0].celebrity.value;
        console.log("result.info.female.celebrity.name ", result.info.female.celebrity.name)
        result.info.female.celebrity.url = await SearchImage(result.info.female.celebrity.name);
      }

      const parsedSimilar = await MsSimilar(faceId);
      result.cohesion = parsedSimilar.confidence;

      result.score = CalcScore(result);
      result.rank = await Rank(result);

      console.log(result);
      
      FileDelete(path.filename);

      res.json({ status: true, result: result });
    }
  }
});

module.exports = router;