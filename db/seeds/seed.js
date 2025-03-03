const db = require("../connection")
const format = require('pg-format');
const { convertTimestampToDate } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
    return db
        //<< write your first query in here.
        .query("DROP TABLE IF EXISTS rides;").then(() => {
            return db.query("DROP TABLE IF EXISTS comments;");
        })
        .then(() => {
            return db.query("DROP TABLE IF EXISTS articles;");
        })
        .then(() => {
            return db.query("DROP TABLE IF EXISTS users;");
        })
        .then(() => {
            return db.query("DROP TABLE IF EXISTS topics;");
        })
        .then(() => {
            return createTopics();
        })
        .then(() => {
            return createUsers();
        })
        .then(() => {
            return createArticles();
        })
        .then(() => {
            return createComments();
        })
        .then(() => {
            const formattedTopicData = topicData.map((topic) =>
                [topic.slug, topic.description, topic.img_url]
            )
            const sql = format(`INSERT INTO topics(slug, description, img_url)
                             VALUES
                             %L
                             RETURNING *;`, formattedTopicData);
            return db.query(sql)
        })
        .then((topics) => {
            const formattedUserData = userData.map((user) =>
                [user.username, user.name, user.avatar_url]
            )
            const sql = format(`INSERT INTO users(username, name, avatar_url)
                             VALUES
                             %L
                             RETURNING *;`, formattedUserData);
            return db.query(sql)

        })
        .then((users) => {
            const formattedArticlesData = articleData.map((article) =>
                [article.title, article.topic, article.author, article.body, convertTimestampToDate( article).created_at, article.votes, article.article_img_url]
            )
            const sql = format(`INSERT INTO articles(title, topic, author,
                                                body, created_at, votes, article_img_url)
                             VALUES
                             %L
                             RETURNING *;`, formattedArticlesData);
            return db.query(sql)
        })
        .then((articles) => {
            const articlesByID = Object.assign({}, ...(articles.rows.map((article) =>
                ({ [article.title]: article.article_id })))
            );

            const formattedCommentData = commentData.map((comment) =>
                [articlesByID[comment.article_title], comment.body, comment.votes, comment.author, convertTimestampToDate(comment).created_at]
            )
            const sql = format(`INSERT INTO comments(article_id, body, votes,
                                                author, created_at)
                             VALUES
                             %L
                             RETURNING *;`, formattedCommentData);
            return db.query(sql)
        })


};

function createTopics() {
    //Create Topics table with columns:
        //slug - primary key (a slug is a term used in publishing to identify an article)
        //description - string giving a brief description of a given topic
        //img_url - string containing a link to an image representing the topic

    return db
        .query(`CREATE TABLE  topics(
            slug VARCHAR(30) PRIMARY KEY, 
            description VARCHAR(250) NOT NULL, 
            img_url VARCHAR(1000));`)
};
function createUsers() {
    //Create Users table each user should have:
        //username - primary key
        //name
        //avatar_url

    return db
        .query(`CREATE TABLE  users(
            username VARCHAR(50) PRIMARY KEY, 
            name VARCHAR(50) NOT NULL, 
            avatar_url VARCHAR(1000) NOT NULL);`)
};
function createArticles() { 
    //Create Articles table each article should have:
        //article_id - primary key
        //title
        //topic - references the slug in the topics table
        //author - references username in the users table
        //body
        //created_at - defaults to the current timestamp
        //votes - defaults to 0
        //article_img_url

    return db
        .query(`CREATE TABLE  articles(
            article_id SERIAL PRIMARY KEY, 
            title VARCHAR(100) NOT NULL, 
            topic VARCHAR(250) NOT NULL REFERENCES topics(slug),
            author VARCHAR(50) NOT NULL REFERENCES users(username),
            body TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            votes INT DEFAULT 0,
            article_img_url VARCHAR(1000) NOT NULL)`)
};
function createComments() {
    //Create Comments table each comment should have:
        //comment_id - primary key
        //article_id -  references an article_id in articles table
        //body
        //votes - defaults to 0
        //author -references username in users table
        //created_at - defaults to the current timestamp

    return db
        .query(`CREATE TABLE  comments(
            comment_id SERIAL PRIMARY KEY, 
            article_id INT NOT NULL REFERENCES articles(article_id), 
            body TEXT NOT NULL,
            votes INT DEFAULT 0,
            author VARCHAR(50) NOT NULL REFERENCES users(username),
            created_at TIMESTAMP NOT NULL DEFAULT NOW())`)
};

module.exports = seed;
