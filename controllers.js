const { response } = require("./app");

const {
    fetchAPI, fetchTopics, fetchArticleByID
} = require("./models");


const getAPI = (request, response) => {
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
        });
}

module.exports = { getAPI, getTopics, getArticleByID };