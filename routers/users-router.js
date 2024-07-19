const express =require("express")
const usersRouter = express.Router()
const { getUsers } = require("../controllers/user-controller.js");

usersRouter.get("/", getUsers);

  module.exports = usersRouter