const endpointsJson = require("../endpoints.json");
const request = require("supertest")
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


