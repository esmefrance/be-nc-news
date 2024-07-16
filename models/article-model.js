const db = require("../db/connection");
const checkArticleExists = require("../db/utils");


exports.fetchArticleByID = (articleID) => {
  return db
    .query(`SELECT *FROM articles WHERE article_id =$1`,[articleID])
    .then(({ rows }) => {
        const article = rows[0]
      if (!article) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return article
    })
    .catch((err) => {
        throw err;
      });
};


exports.fetchAllArticles = () =>{
    return db
    .query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id =articles.article_id
        GROUP BY 
        articles.article_id, 
        articles.title, 
        articles.topic, 
        articles.author, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url
      ORDER BY articles.created_at DESC;
    `)
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      throw err;
    });
};

exports.updateArticle = (articleID, patchInfo) =>{
const voteUpdate = patchInfo.inc_votes
const queryValues =[voteUpdate, articleID]
const promiseArray = [];

let sqlString = 'UPDATE articles SET votes = votes+ $1 WHERE article_id= $2 RETURNING *;'

promiseArray.push(db.query(sqlString, queryValues));

if (articleID !== undefined) {
  promiseArray.push(checkArticleExists(articleID));
}

return Promise.all(promiseArray).then(([queryResults, articleResults]) => {
  if (queryResults.rows.length === 0 && articleResults === false) {
    return Promise.reject({ status: 404, msg: "Not found" });
  }
  return queryResults.rows[0]
});
}