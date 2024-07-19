const express = require('express');
const app = express();
const apiRouter = require('./api-router');
app.use(express.json());

app.use('/api', apiRouter);

app.use(( request, response, next) => {

    response.status(404).send({ msg: "Not found" });
    next();
  });
  
  app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  });
  app.use((err, req, res, next) => {
    if (err.code === "22P02" || err.code === "42703" || err.code === "23502" ) {
      res.status(400).send({ msg: "Bad request" });
    } else next(err);
  });
  
  app.use((err, req, res, next) => {
    if (err.code === "20000" || err.code === "23503" || err.code === "42601") {
      res.status(404).send({ msg: "Not found" });
    } else next(err);
  });
  
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({ msg: "Internal server error" });
  });
  
  module.exports = app;
  