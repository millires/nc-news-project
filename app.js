const express = require("express");
const app = express();

const { getAPI } = require("./controllers")

app.get("/api", getAPI);


module.exports = app;
