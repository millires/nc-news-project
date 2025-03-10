
const { response } = require("./app");

const {
    fetchAPI, fetchTopics
} = require("./models");

const getAPI = (request, response) => {
    const endpoints = fetchAPI()
    response.status(200).send({ endpoints });
};

const getTopics = (request, response, next) => {
    console.log("inside getTopics in controllers");

    fetchTopics()
        .then((rows)  => {
            response.status(200).send({ topics: rows });
    })
       
}

module.exports = { getAPI, getTopics };
