const db = require('../db/connection')

exports.fetchArticleByID = (articleID) =>{
    return db.query(`SELECT * FROM articles WHERE article_id =${articleID};`).then(({rows})=>{
        if(rows.length===0){
            return Promise.reject({status: 400, message: "invalid query"})
            }
            return rows[0]
 } ).catch((err)=>{
throw err
 })
     }
    