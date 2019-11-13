const express = require("express");
const mongoose = require("mongoose");
const Helmet = require("helmet");
const app = express();
const post = require("./routers/post");


const dbURI = process.env.MONGODB_URI || "mongodb://localhost/blog-dev";
app.use(Helmet());
app.use((req, res, next) => {
  mongoose
    .connect(dbURI, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false
    })
    .then(() => next())
    .catch(e => next(e));
});
app.use(auth.initialize());
app.use(express.json());

app.use("/api/post", post);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
