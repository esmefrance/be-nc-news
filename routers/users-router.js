const express =require("express")
const usersRouter = express.Router()
const { getUsers, getUsername } = require("../controllers/user-controller.js");

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUsername);

  module.exports = usersRouter