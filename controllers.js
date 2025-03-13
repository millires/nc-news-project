const { response } = require("./app");

const {
    fetchAPI, fetchTopics, fetchArticleByID, fetchArticles,
    fetchCommentsForArticle, addCommentsForArticle
} = require("./models");


const getAPI = ( _, response) => {
    const endpoints = fetchAPI()
    response.status(200).send({ endpoints });
};

const getTopics = (request, response) => {
    fetchTopics()
        .then((rows)  => {
            response.status(200).send({ topics: rows });
    })      
}

const getArticleByID = (request, response, next) => {
    const articleID = request.params.article_id
    fetchArticleByID(articleID)
        .then((rows) => {
            response.status(200).send({articles: rows})
        })
        .catch((error) => {
            next(error);
        })
}

const getArticles = (request, response) => {
    console.log('getArticles ....')
    fetchArticles()
        .then((rows) => {
            response.status(200).send({ articles: rows })
        })
}

const getCommentsForArticle = (request, response, next) => {
    console.log('getCommentsForArticle ....')

    const articleID = request.params.article_id
    fetchCommentsForArticle(articleID)
        .then((rows) => {
            response.status(200).send({comments: rows})

        })
        .catch((error) => {
            next(error);
        })

}

const postCommentsForArticle = (request, response, next) => {
    console.log('postCommentsForArticle ....')

    const data = request.body
    const articleID = request.params.article_id
    addCommentsForArticle(articleID, data)
        .then((comment) => {
            response.status(200).send({ addedComment: comment[0] })

        })
        .catch((error) => {
            next(error);
        })



}

module.exports = {
    getAPI, getTopics, getArticleByID, getArticles,
    getCommentsForArticle, postCommentsForArticle
};