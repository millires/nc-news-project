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
//an articles array of article objects, each of which should have the following properties:
//            author
//            title
//            article_id
//            topic
//            created_at
//            votes
//            article_img_url
//            comment_count, which is the total count of all the comments with this article_id.You should make use of queries to the database in order to achieve this.
//In addition:

//the articles should be sorted by date in descending order.
//there should not be a body property present on any of the article objects.
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

module.exports = { fetchAPI, fetchTopics, fetchArticleByID, fetchArticles };
