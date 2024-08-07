const db = require("../db/connection");
const {checkArticleExists, checkCommentExists} = require("../db/utils");


exports.fetchCommentsByArticle = (articleID) => {
  const queryValues = [];
  let sqlString = `SELECT * FROM comments `;

  if (articleID) {
    sqlString += `WHERE article_id =$1 `;
    queryValues.push(articleID);
  }
  sqlString += `ORDER BY created_at DESC;`;

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
  const sqlString = `INSERT INTO comments (body, author, article_id) VALUES($1, $2, $3) RETURNING *;`;

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

exports.removeComment = (commentID) =>{
const sqlString = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`
const promiseArray = [];
promiseArray.push(db.query(sqlString, [commentID]));

if (commentID !== undefined) {
  promiseArray.push(checkCommentExists(commentID));
}

return Promise.all(promiseArray).then(([queryResults, commentResults]) => {
  if (queryResults.rows.length === 0 && commentResults === false) {
    return Promise.reject({ status: 404, msg: "Not found" });
  } 
  return queryResults.rows[0];
});
}

exports.updateComment = (commentID, patchInfo) =>{
  const voteUpdate = patchInfo.inc_votes;
  const queryValues = [voteUpdate, commentID];
  const promiseArray = [];

  let sqlString =
    `UPDATE comments SET votes = votes+ $1 WHERE comment_id= $2 RETURNING *;`;

  promiseArray.push(db.query(sqlString, queryValues));

  if (commentID !== undefined) {
    promiseArray.push(checkCommentExists(commentID));
  }

  return Promise.all(promiseArray).then(([queryResults, commentResults]) => {
    if (queryResults.rows.length === 0 && commentResults === false) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return queryResults.rows[0];
  });
}
