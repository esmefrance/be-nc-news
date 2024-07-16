const {fetchCommentsByArticle} =require("../models/comment-model")

exports.getCommentsByArticle =( request, response, next) => {
  const articleID = request.params.article_id
    fetchCommentsByArticle(articleID).then((comments)=>{
        response.status(200).send({ comments: comments });
    }).catch((err)=>{
      next(err)
  })
    }
