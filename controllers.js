const { response } = require("./app");

const {
    fetchAPI
} = require("./models");

const getAPI = (request, response) => {
    const endpoints = fetchAPI()
    response.status(200).send({ endpoints });
};

module.exports = { getAPI };
