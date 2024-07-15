const express = require("express");
const app = express();

const { getTopics, getEndpoints } = require("./controllers/basic-controller");
const { getArticleByID, getAllArticles } = require("./controllers/article-controller");


app.get("/api/", getEndpoints);

app.get("/api/topics/", getTopics);

app.get("/api/articles/:article_id/", getArticleByID);

app.get("/api/articles/", getAllArticles);

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
  } else next(err)
})
  app.use((err, req, res, next) => {
    if (err.code === "22P02" || err.code ==="42703" ) {
      res.status(400).send({ msg: "Bad request" });
    } else next(err)
  });

  app.use((err, req, res, next) => {
    if (err.code === "20000" ) {
      res.status(404).send({ msg: "Not found" });
    } else next(err)
  });

app.use(( err, req, res, next) => {
    res.status(500).send({ msg: "Internal server error" });
})


module.exports = app;
