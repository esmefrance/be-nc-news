const express = require("express");
const app = express();
app.use(express.json());
const endpoints =require("./endpoints.json")

const { getTopics } = require("./controllers/basic-controller");

app.get("/api/topics/", getTopics);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } 
  else if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } 
  else res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;