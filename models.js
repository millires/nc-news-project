const db = require("./db/connection");

const endpoints = require("./endpoints.json")

const fetchAPI = () => {
    return endpoints;
};

const fetchTopics = () => {
    return db
       .query(`SELECT * FROM topics;`)
        .then(({ rows }) => {
            return rows
        })
};

module.exports = { fetchAPI, fetchTopics };
