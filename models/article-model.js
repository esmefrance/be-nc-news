const db = require("../db/connection");
const { checkArticleExists } = require("../db/utils");

exports.fetchArticleByID = (articleID) => {
  return db
    .query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id =comments.article_id WHERE articles.article_id =$1 GROUP BY  articles.article_id,
  articles.title,
  articles.topic,
  articles.author,
  articles.created_at,
  articles.votes,
  articles.article_img_url;`, [articleID])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return article;
    })
    .catch((err) => {
      throw err;
    });
};

exports.fetchAllArticles = (topic, sort_by = "created_at", order = "DESC") => {
  const validSortBys = ["title", "topic", "author", "votes", "created_at"];
  const validOrderBys = ["ASC", "DESC"];
  const validTopics = ["mitch", "cats", "coding", "football", "cooking"];
  if (!validSortBys.includes(sort_by) || !validOrderBys.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  let queryString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id =comments.article_id`;

  if (topic) {
    if (!validTopics.includes(topic)) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    }
    queryString += ` WHERE articles.topic='${topic}'`;
  }

  queryString += ` GROUP BY  articles.article_id,
  articles.title,
  articles.topic,
  articles.author,
  articles.created_at,
  articles.votes,
  articles.article_img_url ORDER BY articles.${sort_by} ${order};`;

  return db
    .query(queryString)
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      throw err;
    });
};

exports.updateArticle = (articleID, patchInfo) => {
  const voteUpdate = patchInfo.inc_votes;
  const queryValues = [voteUpdate, articleID];
  const promiseArray = [];

  let sqlString =
    `UPDATE articles SET votes = votes+ $1 WHERE article_id= $2 RETURNING *;`;

  promiseArray.push(db.query(sqlString, queryValues));

  if (articleID !== undefined) {
    promiseArray.push(checkArticleExists(articleID));
  }

  return Promise.all(promiseArray).then(([queryResults, articleResults]) => {
    if (queryResults.rows.length === 0 && articleResults === false) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return queryResults.rows[0];
  });
};

exports.createArticle = ({author, title, body, topic, article_img_url}) =>{
  const queryValues = [author, title, body, topic, article_img_url]

  
  const sqlString = `INSERT INTO articles (author, title, body, topic, article_img_url) VALUES($1, $2, $3, $4, $5) RETURNING *;`;

  return db
  .query(sqlString, queryValues)
  .then(({ rows }) => {
    return rows[0]
  })
  .catch((err) => {
    throw err;
  });
}
