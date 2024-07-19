const express = require('express');
const router = express.Router();
router.use(express.json());

const topicsRouter = require('./topics-router');
const articlesRouter = require('./articles-router');
const usersRouter = require('./users-router');
const commentsRouter = require('./comments-router')

const { getEndpoints } = require("../controllers/api-controller");

router.get('/', getEndpoints);

router.use('/topics', topicsRouter);
router.use('/articles', articlesRouter);
router.use('/users', usersRouter);
router.use('/comments', commentsRouter)

module.exports = router;

