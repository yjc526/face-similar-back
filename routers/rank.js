const mongoose = require("mongoose");
const Score = require("../models/score");

const dbURI = process.env.MONGODB_URI || "mongodb://localhost/face-similar";

async function calc_rank(result) {
    const rank = { "max": null, "similar": null, "male": null, "female": null };

    mongoose
    .connect(dbURI, {
        //playground DB
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log("DB에 연결 되었습니다!"))
    .catch(error => console.error(error));

    console.log(result.score);
    const score = new Score(result.score);  // MongoDB에 점수 저장

    console.log("score", score);
    await score.save();

    rank.max = await Score.find().count();
    rank.similar = await Score.find({ similar: { $gt: result.score.similar } }).count() + 1;
    rank.male = await Score.find({ male: { $gt: result.score.male } }).count() + 1;
    rank.female = await Score.find({ female: { $gt: result.score.female } }).count() + 1;

    console.log("similar: ", rank.similar);

    mongoose.disconnect();

    return rank;
}

module.exports = calc_rank