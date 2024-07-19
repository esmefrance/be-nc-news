const express = require('express');
const topicsRouter = express.Router();
const { getTopics } = require("../controllers/topic-controller");


topicsRouter.get('/', getTopics);

module.exports = topicsRouter;