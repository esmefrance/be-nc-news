const db = require("../db/connection");

exports.fetchAllUsers = () =>{
    return db
    .query(`SELECT * FROM users;`)
    .then(({ rows }) => {
      return rows
    })
    .catch((err) => {
        throw err;
      });
}