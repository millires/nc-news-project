const db = require("./db/connection");
const format = require('pg-format')

const { forEach, sort } = require("./db/data/test-data/articles");
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

const fetchArticles = (sortby, orderby) => {
    let sql = `SELECT 
                    articles.author, articles.title, articles.article_id,
                    articles.topic, articles.created_at, articles.votes,
                    articles.article_img_url, 
                    COUNT(comments.article_id)::INT AS comment_count
                FROM articles
                LEFT JOIN comments
                ON articles.article_id = comments.article_id
                GROUP BY
                    articles.author, articles.title, articles.article_id,
                    articles.topic, articles.created_at, articles.votes,
                    articles.article_img_url `
    console.log(!!sortby)
    if (!!sortby) {
        sql += 'ORDER BY created_at DESC;'
        console.log(sql)
    }
    return db
        .query(sql)
        .then(({ rows }) => {
            //console.log(rows)
            return rows
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

const removeComment = (id) => {

    return db.query('DELETE FROM comments WHERE comment_id = $1;', [id])
        .then(({ rows }) => {
            return rows
        })
};

const fetchUsers = () => {

    return db.query('SELECT * FROM users;')
        .then(({ rows }) => {
            return rows
        })


};

const fetchArticlesSortedBy = (sortBy) => {


};

module.exports = {
    fetchAPI, fetchTopics, fetchArticleByID, fetchArticles,
    fetchCommentsForArticle, addCommentsForArticle,
    updateArticleVotes, removeComment, fetchUsers,
    fetchArticlesSortedBy
};
