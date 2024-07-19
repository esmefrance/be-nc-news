const express =require("express")
const commentsRouter = express.Router()
const {
    deleteComment,
  } = require("../controllers/comment-controller.js");

  commentsRouter.delete("/:comment_id/", deleteComment);

  module.exports = commentsRouter