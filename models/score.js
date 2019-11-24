const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const scoreSchema = new Schema({
  similar: Number,
  male: Number,
  female: Number
});

const Score = model("score", scoreSchema);

module.exports = Score
