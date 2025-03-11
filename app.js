const express = require("express");
const app = express();

app.use(express.json());

const { getAPI, getTopics, getArticleByID, getArticles } = require("./controllers")
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./error_handler')

app.get("/api", getAPI);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleByID)

app.get("/api/articles", getArticles)


app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
