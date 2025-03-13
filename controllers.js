const { request } = require("http");
const { response } = require("./app");

const {
    fetchAPI, fetchTopics, fetchArticleByID, fetchArticles,
    fetchCommentsForArticle, addCommentsForArticle,
    updateArticleVotes
} = require("./models");


const getAPI = ( _, response) => {
    const endpoints = fetchAPI()
    response.status(200).send({ endpoints });
};

const getTopics = (request, response) => {
    fetchTopics()
        .then((rows) => {
            response.status(200).send({ topics: rows });
        })
};

const getArticleByID = (request, response, next) => {
    const articleID = request.params.article_id
    fetchArticleByID(articleID)
        .then((rows) => {
            response.status(200).send({ articles: rows })
        })
        .catch((error) => {
            next(error);
        })
};

const getArticles = (request, response) => {
    fetchArticles()
        .then((rows) => {
            response.status(200).send({ articles: rows })
        })
};

const getCommentsForArticle = (request, response, next) => {
    const articleID = request.params.article_id
    fetchCommentsForArticle(articleID)
        .then((rows) => {
            response.status(200).send({ comments: rows })
        })
        .catch((error) => {
            next(error);
        })
};

const postCommentsForArticle = (request, response, next) => {
    const data = request.body
    const articleID = request.params.article_id
    addCommentsForArticle(articleID, data)
        .then((comment) => {
            response.status(200).send({ addedComment: comment[0] })
        })
        .catch((error) => {
            next(error);
        })
};

const patchArticleVotes = (request, response, next) => {
    const { inc_votes } = request.body
    const { article_id } = request.params
    updateArticleVotes(article_id, inc_votes)
        .then(( rows ) => {
            response.status(200).send({ article: rows[0] })
        })
        .catch((error) => {
            next(error);
        })
};

module.exports = {
    getAPI, getTopics, getArticleByID, getArticles,
    getCommentsForArticle, postCommentsForArticle,
    patchArticleVotes
};