const { request } = require("http");
const { response } = require("./app");

const {
    fetchAPI, fetchTopics, fetchArticleByID, fetchArticles,
    fetchCommentsForArticle, addCommentsForArticle,
    updateArticleVotes, removeComment, fetchUsers, fetchArticlesSortedBy
} = require("./models");

const { sort } = require("./db/data/test-data/users");


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
    console.log('getArticles .............')
    console.log(request.params)
    console.log(request.query)
    const { sortby, orderby }= request.query
    console.log(!sortby, !!orderby)
    fetchArticles(sortby, orderby)
        .then((rows) => {
            articles: rows
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

const deleteComment = (request, response, next) => {
    const { comment_id } = request.params
    removeComment(comment_id)
        .then((rows) => {
            response.status(204).send()
        })
        .catch((error) => {
            next( error)
        })
};

const getUsers = (request, response) => {

    fetchUsers()
        .then((rows) => {
            response.status(200).send({users: rows})
    })
};

const getArticlesSortedBy = (request, response) => {
    console.log('getArticlesSortedBy .............')
    const sortBy = request.query
    console.log(sortBy)

    fetchArticlesSortedBy(sortBy)


};


module.exports = {
    getAPI, getTopics, getArticleByID, getArticles,
    getCommentsForArticle, postCommentsForArticle,
    patchArticleVotes, deleteComment, getUsers,
    getArticlesSortedBy
};