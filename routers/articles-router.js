const express = require('express');
const articlesRouter = express.Router();

const {
    getArticleByID,
    getAllArticles,
    patchArticle, postArticle
  } = require("../controllers/article-controller");
  const {
    getCommentsByArticle,
    postCommentToArticle,
  } = require("../controllers/comment-controller.js");

articlesRouter.get("/", getAllArticles);

articlesRouter.get("/:article_id/", getArticleByID);

articlesRouter.patch("/:article_id/", patchArticle);

articlesRouter.get("/:article_id/comments/", getCommentsByArticle);

articlesRouter.post("/:article_id/comments/", postCommentToArticle);

articlesRouter.post("/", postArticle)

module.exports = articlesRouter;