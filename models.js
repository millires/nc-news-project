const db = require("./db/connection");
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
                    msg: "id cannot be found",
                });
            }
            return rows
        })
}

const fetchArticles = () => {
    console.log('fetchArticles ....')

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
}

const fetchCommentsForArticle = (articleID) => {
    console.log('fetchCommentsForArticle ....')

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


}

module.exports = {
    fetchAPI, fetchTopics, fetchArticleByID, fetchArticles,
    fetchCommentsForArticle
};
