const express = require("express");
const app = express();

const { getTopics, getEndpoints } = require("./controllers/basic-controller");
const { getArticleByID, getAllArticles, patchArticle } = require("./controllers/article-controller");
const {getCommentsByArticle, postCommentToArticle, deleteComment} =require("./controllers/comment-controller.js")

app.use(express.json());

app.get("/api/", getEndpoints);

app.get("/api/topics/", getTopics);

app.get("/api/articles/:article_id/", getArticleByID);

app.get("/api/articles/", getAllArticles);

app.get("/api/articles/:article_id/comments/", getCommentsByArticle)

app.post("/api/articles/:article_id/comments/", postCommentToArticle)

app.patch("/api/articles/:article_id/", patchArticle)

app.delete("/api/comments/:comment_id/", deleteComment)

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
  } else next(err)
})
  app.use((err, req, res, next) => {
    if (err.code === "22P02" || err.code ==="42703"|| err.code ==="23502") {

      res.status(400).send({ msg: "Bad request" });
    } else next(err)
  });

  app.use((err, req, res, next) => {
    if (err.code === "20000" ||err.code ==="23503" ) {

      res.status(404).send({ msg: "Not found" });
    } else next(err)
  });

app.use(( err, req, res, next) => {
  console.error(err)
    res.status(500).send({ msg: "Internal server error" });
})


module.exports = app;
