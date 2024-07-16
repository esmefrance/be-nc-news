const getArticleByID  = require("../controllers/article-controller");
const db = require("../db/connection");
const checkArticleExists =require("../db/utils")

exports.fetchCommentsByArticle = (articleID) =>{
const queryValues = []
let sqlString = 'SELECT * FROM comments '

if(articleID){ 
    sqlString+= 'WHERE article_id =$1 '
    queryValues.push(articleID)
}
sqlString+= 'ORDER BY created_at DESC;'

const promiseArray = []
promiseArray.push(db.query(sqlString, queryValues))

if(articleID !== undefined){
    promiseArray.push(checkArticleExists(articleID))
}

return Promise.all(promiseArray).then(([queryResults, articleResults])=>{
    if(queryResults.rows.length ===0 && articleResults===false){
        return Promise.reject({ status: 404, msg: "Not found" })
    }

    return queryResults.rows
})

    // return db
    //   .query(sqlString, queryValues)
    //   .then(({ rows }) => {
    //       const comments = rows
    //       if(checkArticleExists(articleID)&& comments.length===0){
    //         return Promise.reject({ status: 200, msg: "No comments found" });
    //       }
    //     if (comments.length===0) {
    //       return Promise.reject({ status: 404, msg: "Not found" });
    //     }
    //     return comments
    //   })
    //   .catch((err) => {
    //       throw err;
    //     });
  };