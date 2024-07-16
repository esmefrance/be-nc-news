const {fetchCommentsByArticle, addCommentToArticle} =require("../models/comment-model")

exports.getCommentsByArticle =( request, response, next) => {
  const articleID = request.params.article_id
    fetchCommentsByArticle(articleID).then((comments)=>{
        response.status(200).send({ comments: comments });
    }).catch((err)=>{
      next(err)
  })
    }

    exports.postCommentToArticle =(request, response, next) =>{
      const articleID = request.params.article_id
      const postInfo = request.body
      addCommentToArticle(articleID, postInfo).then((result)=>{
        response.status(200).send(result);
    }).catch((err)=>{
      next(err)
  })
    }
