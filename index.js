const express = require("express");
const Helmet = require("helmet");
const cors = require("cors");
const app = express();

const post = require("./routers/post");

app.use(Helmet());
app.use(cors());
app.use(express.json());

app.use("/api/post", post);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
