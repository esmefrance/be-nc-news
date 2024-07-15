const express = require("express");
const app = express();

const { getTopics, getEndpoints } = require("./controllers/basic-controller");

app.get("/api/topics/", getTopics);

app.get("/api/", getEndpoints);

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).send({ msg: "Internal server error" });
  }
});

module.exports = app;
