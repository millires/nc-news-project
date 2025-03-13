const db = require("./db/connection");
const format = require('pg-format')

const { forEach } = require("./db/data/test-data/articles");
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
                    msg: "not found",
                });
            }
            return rows
        })
};

const fetchArticles = () => {
    return db
        .query(`SELECT author, title, article_id, topic, 
                        created_at, votes, article_img_url
                FROM articles ORDER BY created_at DESC;`)
        .then(({ rows }) => {
            return rows
        })
        .then((articles) => {
            return db
                .query(`SELECT article_id, count(article_id) FROM comments GROUP BY article_id;`)
                .then(({ rows }) => {
                    let counts = Object.assign({}, ...(rows.map((row) =>
                        ({ [row.article_id]: row.count }))))

                    articles.forEach((article) => {
                        article.comment_count = Number(counts[article.article_id]) || 0

                    })
                    return articles
                })
        })
};

const fetchCommentsForArticle = (articleID) => {
    return db
        .query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [articleID])
        .then(({ rows }) => {
            if (!rows[0]) {
                return Promise.reject({
                    status: 404,
                    msg: "id cannot be found",
                });
            }
            return rows
        })
};

const addCommentsForArticle = (articleID, data) => {
    return fetchArticleByID(articleID)
        .then((rows) => {
            //const article = rows[0]
            const formattedCommentData = [Number(articleID), data.body, data.username]
            const sql = format(`INSERT INTO comments(article_id, body, author)
                        VALUES
                        %L
                        RETURNING *;`, [formattedCommentData])
            return db.query(sql)
        })
        .then(({ rows }) => {
            return rows
        })
};

const updateArticleVotes = (id, inc_vote) => {
    return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;', [inc_vote, id])
        .then(({ rows }) => {
            if (!rows[0]) {
                return Promise.reject({
                    status: 404,
                    msg: "not found",
                });
            }
            return rows
        })
};

module.exports = {
    fetchAPI, fetchTopics, fetchArticleByID, fetchArticles,
    fetchCommentsForArticle, addCommentsForArticle,
    updateArticleVotes
};
