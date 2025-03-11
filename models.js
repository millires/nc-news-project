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

const fetchArticleByID = (articleID) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1;`, [articleID])
        .then(({ rows }) => {
            if (!rows[0]) {
                return Promise.reject({
                    status: 404,
                    msg: "id cannot be found",
                });
            }
            return rows
        })
}

module.exports = { fetchAPI, fetchTopics, fetchArticleByID };
