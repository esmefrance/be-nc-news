const getArticleByID = require("../controllers/article-controller");
const db = require("../db/connection");
const checkArticleExists = require("../db/utils");


exports.fetchCommentsByArticle = (articleID) => {
  const queryValues = [];
  let sqlString = "SELECT * FROM comments ";

  if (articleID) {
    sqlString += "WHERE article_id =$1 ";
    queryValues.push(articleID);
  }
  sqlString += "ORDER BY created_at DESC;";

  const promiseArray = [];
  promiseArray.push(db.query(sqlString, queryValues));

  if (articleID !== undefined) {
    promiseArray.push(checkArticleExists(articleID));
  }

  return Promise.all(promiseArray).then(([queryResults, articleResults]) => {
    if (queryResults.rows.length === 0 && articleResults === false) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }

    return queryResults.rows;
  });
};

exports.addCommentToArticle = (articleID, { body, author}) => {
  const article_id = articleID
  const queryValues = [body, author, article_id];
  const promiseArray = [];
  let sqlString = `INSERT INTO comments (body, author, article_id) VALUES($1, $2, $3) RETURNING *;`;

  promiseArray.push(db.query(sqlString, queryValues));

  if (articleID !== undefined) {
    promiseArray.push(checkArticleExists(articleID));
  }

  return Promise.all(promiseArray).then(([queryResults, articleResults]) => {
    if (queryResults.rows.length === 0 && articleResults === false) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else if(body.length ===0){
      return Promise.reject({ status: 400, msg: "Bad request" });
    }

    return queryResults.rows[0];
  });
};
