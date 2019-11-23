const { Score } = require("../models/score");

async function rank(result) {
    const rank = { "max": null, "similar": null, "male": null, "female": null };

    let score = new Score(result.score);  // MongoDB에 점수 저장
    const saveResult = await score.save();


    rank.max = Score.find().count();
    rank.similar = Score.find({ score: { $gt: result.score.similar } }).count() + 1;
    rank.male = Score.find({ score: { $gt: result.score.male } }).count() + 1;
    rank.female = Score.find({ score: { $gt: result.score.female } }).count() + 1;

    return rank;
}

module.exports = rank