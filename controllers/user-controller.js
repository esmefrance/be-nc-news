const { fetchAllUsers, fetchUsername } = require("../models/user-model");

exports.getUsers = (request, response, next) => {
  fetchAllUsers()
    .then((users) => {
      response.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsername = (request, response, next) => {
  const username = request.params.username;
  fetchUsername(username)
    .then((user) => {
      response.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};
