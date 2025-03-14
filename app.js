const express = require("express");
const app = express();

app.use(express.json());

const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./error_handler')
const { getAPI, getTopics, getArticleByID, getArticles,
    getCommentsForArticle, postCommentsForArticle,
    patchArticleVotes, deleteComment, getUsers } = require("./controllers")


app.get("/api", getAPI);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleByID)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsForArticle)

app.post("/api/articles/:article_id/comments", postCommentsForArticle)

app.patch("/api/articles/:article_id", patchArticleVotes)

app.delete("/api/comments/:comment_id", deleteComment)

app.get("/api/users", getUsers)

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
