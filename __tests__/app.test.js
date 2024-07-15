const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("GET API topics", () => {
  it("should respond with an array of topic objects", () => {
    return request(app)
      .get("/api/topics/")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.topics)).toBe(true);
      });
  });
  it("each topic object should include a 'slug' and 'description' property", () => {
    return request(app)
      .get("/api/topics/")
      .expect(200)
      .then(({ body }) => {
        body.topics.forEach((topic) => {
          expect(topic).toEqual({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET Endpoints", () => {
  it("should respond with a json detailing all available endpoints", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("GET articles by ID", () => {
  test("should return an object with the relevant properties ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400: should return an error when invalid article ID is entered e.g. 'cat' ", () => {
    return request(app)
      .get("/api/articles/cat")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404 should return an error when an incorrect article ID is entered e.g.'123456789' ", () => {
    return request(app)
      .get("/api/articles/123456789")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET all articles", () => {
  test("should respond with array of article objects", () => {
    return request(app)
      .get("/api/articles/")
      .expect(200)
      .then((response) => {  
        const articles = response.body.articles
        articles.forEach((article) => {
          expect(article).toEqual({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String)
          });
        });
      });
  });
  test("responds with the articles ordered by created_date descending by default",()=>{
    return request(app)
    .get("/api/articles/")
    .expect(200)
    .then((response) => {  
        const articles = response.body.articles
      expect(articles).toBeSortedBy( 'created_at', { descending: true})
  })
});
});
