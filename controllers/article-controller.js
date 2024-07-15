const {fetchArticleByID}= require("../models/article-model")

exports.getArticleByID =(request, response, next) => {
    const articleID = request.params.article_id
    fetchArticleByID(articleID).then((article) => {
        response.status(200).send({ article: article });
      }).catch((err)=>{
        next(err)
    })
  };
