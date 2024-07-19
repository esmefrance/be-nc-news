const db = require("../db/connection");
const { checkUserExists } = require("../db/utils");

exports.fetchAllUsers = () => {
  return db
    .query(`SELECT * FROM users;`)
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      throw err;
    });
};

exports.fetchUsername = (username) => {
  return checkUserExists(username).then(() => {
    return db
      .query(`SELECT * FROM users WHERE username=$1 ;`, [username])
      .then(({ rows }) => {
        return rows[0];
      })
      .catch((err) => {
        throw err;
      });
  });
};
