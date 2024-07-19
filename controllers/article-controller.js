const {fetchArticleByID, fetchAllArticles, updateArticle, createArticle}= require("../models/article-model")

exports.getArticleByID =( request, response, next) => {
    const articleID = request.params.article_id
    fetchArticleByID(articleID).then((article) => {
   response.status(200).send({ article: article });
    }).catch((err)=>{
        next(err)
    })
}

  exports.getAllArticles =( request, response, next) => {
    const {topic, sort_by, order} = request.query
    fetchAllArticles(topic, sort_by, order).then((articles) => {
        response.status(200).send({ articles: articles });
      }).catch((err)=>{
        next(err)
    })
  };

  exports.patchArticle = ( request, response, next) => {
    const articleID = request.params.article_id
    const patchInfo = request.body
    updateArticle(articleID, patchInfo).then((article) => {
      response.status(200).send({ article: article });
    }).catch((err)=>{
      next(err)
  })
  }

  exports.postArticle = ( request, response, next) => {
    const postInfo = request.body
    createArticle(postInfo).then((article) => {
      response.status(201).send({ article: article });
    }).catch((err)=>{
      next(err)
  })
  }