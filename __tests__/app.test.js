const endpointsJson = require("../endpoints.json");
const request = require("supertest")
const sorted = require("jest-sorted")

/* Set up your test imports here */
const app = require("../app.js")

/* Set up your beforeEach & afterAll functions here */
const db = require("../db/connection")
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');

beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () => {
    test("200: Responds with an an array of topic objects, each of which should have the properties of slug and description ", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => { 
                const topics = body.topics
                topics.forEach((topic) => {
                    const { slug, description, img_url } = topic
                    expect(typeof slug).toBe("string");
                    expect(typeof description).toBe("string");
                    expect(typeof img_url).toBe("string");
                })
            });
    });
});
describe("GET /api/articles/:article_id", () => {
    test("200: gets an article by its ID", () => {
        return request(app)
            .get("/api/articles/3")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles
                articles.forEach((article) => {
                    const { author,
                        title,
                        article_id,
                        body,
                        topic,
                        created_at,
                        votes,
                        article_img_url } = article

                    expect(typeof author).toBe("string");
                    expect(typeof title).toBe("string");
                    expect(typeof article_id).toBe("number");
                    expect(article_id).toBe(3);
                    expect(typeof body).toBe("string");
                    expect(typeof topic).toBe("string");
                    expect(typeof created_at).toBe("string");
                    expect(typeof votes).toBe("number");
                    expect(typeof article_img_url).toBe("string");
                })
            });

    });
    test("404: requests an article when ID does not exist return 'id cannot be found'", () => {
        return request(app)
            .get("/api/articles/300")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");

            })
    });
    test("400: responds with message 'bad request' if invalid id data type", () => {
        return request(app)
            .get("/api/articles/banana")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request");
            });
    });
});
describe("GET /api/articles", () => {
    test("200: gets all articles", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles
                articles.forEach((article) => {
                    const { author,
                        title,
                        article_id,
                        topic,
                        created_at,
                        votes,
                        article_img_url,
                        comment_count } = article

                    expect(typeof author).toBe("string");
                    expect(typeof title).toBe("string");
                    expect(typeof article_id).toBe("number");
                    expect(typeof topic).toBe("string");
                    expect(typeof created_at).toBe("string");
                    expect(typeof votes).toBe("number");
                    expect(typeof article_img_url).toBe("string");
                    expect(typeof comment_count).toBe("number");

                })
            });

    });
    test("200: gets all articles sorted by date created", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles

                expect(articles).toBeSorted()
                expect(articles).toBeSortedBy('created_at', { descending: true })
            });
    });

});
describe("GET /api/articles/:article_id/comments", () => {
    test("200: returns an array of comments for the given article_id", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                const comments = body.comments
                comments.forEach((comment) => {
                    const { comment_id,
                        article_id,
                        body,
                        votes,
                        author,
                        created_at,
                        } = comment

                    expect(typeof comment_id).toBe("number");
                    expect(typeof article_id).toBe("number");
                    expect(typeof body).toBe("string");
                    expect(typeof votes).toBe("number");
                    expect(typeof author).toBe("string");
                    expect(typeof created_at).toBe("string");
 
                })
            });
    });
    test("200: gets all articles sorted by date created", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                const comments = body.comments

                expect(comments).toBeSorted()
                expect(comments).toBeSortedBy('created_at', { descending: true })
            });
    });
    test("404: requests an comments when article ID does not exist return 'id cannot be found'", () => {
        return request(app)
            .get("/api/articles/199/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("id cannot be found");

            })
    });
    test("400: responds with message 'bad request' if invalid data type", () => {
        return request(app)
            .get("/api/articles/xyz/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request");
            });
    });
});
describe("POST /api/articles/:article_id/comments", () => {
    test("200: returns an array with the comment added for the given article_id", () => {
        return request(app)
            .post("/api/articles/1/comments")
            .send({
                username: 'butter_bridge',
                body: 'great article! ...'
            })
            .expect(200)
            .then((res) => {
                const { comment_id,
                article_id,
                body,
                votes,
                author,
                created_at,
                } = res.body.addedComment

                expect(typeof comment_id).toBe("number");
                expect(article_id).toBe(1);
                expect(body).toBe('great article! ...');
                expect(votes).toBe(0);
                expect(author).toBe("butter_bridge");
                expect(typeof created_at).toBe("string");

            });
    });
    test("404: add a comment with a non existing article ID returns 'not be found'", () => {
        return request(app)
            .post("/api/articles/199/comments")
            .send({
                username: 'butter_bridge',
                body: 'great article! ...'
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");
            })
    });
    test("404: add a comment article ID returns not matching author 'not be found'", () => {
        return request(app)
            .post("/api/articles/199/comments")
            .send({
                username: 'kamel',
                body: 'great article! ...'
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");
            })
    });
    test("404: add a comment with an empty body returns 'id cannot be found'", () => {
        return request(app)
            .post("/api/articles/199/comments")
            .send({
                username: 'butter_bridge',
                body: ''
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");

            })
    });

});

describe("PATCH /api/articles/:article_id", () => {
    test("200: update article's votes for article_id = 1 by 1 and responds with the updated article", () => {
        return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then((res) => {
                const { author,
                    title,
                    article_id,
                    body,
                    topic,
                    created_at,
                    votes,
                    article_img_url } = res.body.article

                expect(author).toBe("butter_bridge");
                expect(article_id).toBe(1);
                expect(typeof body).toBe('string');
                expect(typeof topic).toBe("string")
                expect(typeof created_at).toBe("string");
                expect(votes).toBe(101);
                expect(typeof article_img_url).toBe("string");
            });
    });
    test("200: decrese article's votes for article_id = 1 by 10 and responds with the updated article", () => {
        return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -10 })
            .expect(200)
            .then((res) => {
                const { author,
                    title,
                    article_id,
                    body,
                    topic,
                    created_at,
                    votes,
                    article_img_url } = res.body.article

                expect(author).toBe("butter_bridge");
                expect(article_id).toBe(1);
                expect(typeof body).toBe('string');
                expect(typeof topic).toBe("string")
                expect(typeof created_at).toBe("string");
                expect(votes).toBe(90);
                expect(typeof article_img_url).toBe("string");
            });
    });
    test("404: update article's votes for a non existing article ID returns 'not be found'", () => {
        return request(app)
            .patch("/api/articles/199")
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");
            })
    });
    test("400: responds with message 'bad request' if invalid data type for ID", () => {
        return request(app)
            .patch("/api/articles/xyz")
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request");
            });
    });
    test("400: responds with message 'bad request' if invalid data type for inc_votes", () => {
        return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 'a' })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request");
            });
    });
});

