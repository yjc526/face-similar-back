const express = require("express");
const router = express.Router();
const auth = require("../common/auth")();
const { Post, validatePost } = require("../models/post");
router.post("/", auth.authenticate(), async (req, res, next) => {
  const { title, contents, tags } = req.body;
  if (validatePost(req.body).error) {
    res.status(400).json({ result: false });
    next();
    return;
  }
  const post = new Post({
    title,
    author: req.user.id,
    contents,
    tags
  });
  await post.save();
  res.json({ result: true });
  next();
});

module.exports = router;
