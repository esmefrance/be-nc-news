const {
  fetchCommentsByArticle,
  addCommentToArticle, removeComment, updateComment
} = require("../models/comment-model");

exports.getCommentsByArticle = (request, response, next) => {
  const articleID = request.params.article_id;
  fetchCommentsByArticle(articleID)
    .then((comments) => {
      response.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentToArticle = (request, response, next) => {
  const articleID = request.params.article_id;
  const postInfo = request.body;
  addCommentToArticle(articleID, postInfo)
    .then((result) => {
      response.status(201).send({ comment: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment =(request, response, next) => {
  const commentID = request.params.comment_id;
  removeComment(commentID)
  .then((result) => {
    response.status(204).send()
  })
  .catch((err) => {
    next(err);
  });
}

exports.patchComment =(request, response, next) => {
  const commentID = request.params.comment_id;
  const patchInfo = request.body
  updateComment(commentID, patchInfo)
  .then((comment) => {
    response.status(200).send({ comment: comment });
  })
  .catch((err) => {
    next(err);
  });
}
