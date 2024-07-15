const express = require("express");
const app = express();

const { getTopics, getEndpoints } = require("./controllers/basic-controller");
const { getArticleByID } = require("./controllers/article-controller");


app.get("/api/", getEndpoints);

app.get("/api/topics/", getTopics);

app.get("/api/articles/:article_id/", getArticleByID);

  app.use((err, req, res, next) => {
    if (err.code === "22P02" ) {
      res.status(400).send({ msg: "Bad request" });
    } 
    else if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } 
    else res.status(500).send({ msg: "Internal server error" });
  });

module.exports = app;
