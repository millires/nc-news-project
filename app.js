const express = require("express");
const app = express();

app.use(express.json());

const { getAPI, getTopics } = require("./controllers")

app.get("/api", getAPI);

app.get("/api/topics", getTopics);

module.exports = app;
