const {fetchAllUsers} = require("../models/user-model");

exports.getUsers= (request, response, next) => {
    fetchAllUsers().then((users) => {
        response.status(200).send({ users: users});
      })
      .catch((err) => {
        next(err);
      });
}