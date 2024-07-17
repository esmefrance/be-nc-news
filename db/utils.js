const db = require("../db/connection");

function checkArticleExists (articleID) {
    return db.query('SELECT * FROM articles WHERE article_id =$1',[articleID]).then(({rows})=>{
        if(rows.length ===0){
            return false
        } else if(rows.length===1){
            return true
        }
    })
}

function checkCommentExists (commentID) {
    return db.query('SELECT * FROM comments WHERE comment_id =$1',[commentID]).then(({rows})=>{
        if(rows.length ===0){
            return false
        } else if(rows.length===1){
            return true
        }
    })
}

module.exports = {checkArticleExists, checkCommentExists}