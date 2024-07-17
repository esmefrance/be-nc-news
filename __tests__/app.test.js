const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");
const express = require("express");

app.use(express.json());

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
  test("400: error when invalid article ID is entered e.g. 'cat' ", () => {
    return request(app)
      .get("/api/articles/cat")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404:error when an incorrect article ID is entered e.g.'123456789' ", () => {
    return request(app)
      .get("/api/articles/123456789")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET all articles", () => {
  test("respond with array of article objects", () => {
    return request(app)
      .get("/api/articles/")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        if (articles.length > 0) {
          articles.forEach((article) => {
            expect(article).toEqual({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        }
      });
  });
  test("responds with the articles ordered by created_date descending by default", () => {
    return request(app)
      .get("/api/articles/")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET all article comments", () => {
  test("respond with all comments for a specific article", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        if (comments.length > 0) {
          comments.forEach((comment) => {
            expect(comment).toEqual({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 9,
            });
          });
        }
      });
  });
  test('comments should be sorted by "created_at" descending', () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("should return an empty array if the article exists but there are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toEqual([]);
      });
  });
  test("404:error when an incorrect article ID is entered e.g.'123456789' ", () => {
    return request(app)
      .get("/api/articles/123456789/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments/", () => {
  test("should add a comment to an article ", () => {
    return request(app)
      .post("/api/articles/2/comments/")
      .send({
        body: "Laptops are useful!",
        author: "rogersop",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 19,
          body: "Laptops are useful!",
          article_id: 2,
          author: "rogersop",
        });
      });
  });
  test("404: Not found error when an incorrect article ID is entered e.g.'123456789' ", () => {
    return request(app)
      .post("/api/articles/123456789/comments")
      .send({
        body: "I like pears!",
        author: "rogersop",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });

  test("400: Bad request error if no comment is sent ", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        body: "",
        author: "rogersop",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: Bad request error if invalid article_id", () => {
    return request(app)
      .post("/api/articles/bananas/comments")
      .send({
        body: "I like bananas!",
        author: "rogersop",
      })
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: Not found error if author does not exist", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        body: "I like apples!",
        author: "sandra",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/articles/:article_id/", () => {
  test("when the article votes property is missing, it should add votes to an article with the matching article_id", () => {
    return request(app)
      .patch("/api/articles/3/")
      .send({ inc_votes: 10 })
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          created_at: expect.any(String),
          votes: 10,
          article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("should update votes count, when there is an existing property and value on the article", () => {
    return request(app)
      .patch("/api/articles/1/")
      .send({ inc_votes: -10 })
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          votes: 90,
        });
      });
  });
  test("400: Bad request error when no inc_votes value is sent", () => {
    return request(app)
      .patch("/api/articles/1/")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: Not found error when invalid article_id is sent", () => {
    return request(app)
      .patch("/api/articles/123456789/")
      .send({ inc_votes: 100 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });

  test(" 400: Bad request error when invalid vote_inc data is sent", () => {
    return request(app)
      .patch("/api/articles/1/")
      .send({ inc_votes: "ten" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id/", () => {
  test("should delete a comment by comment_id", () => {
    return request(app).delete("/api/comments/11").expect(204);
  });

  test("404: Not found error if comment_id does not exist ", () => {
    return request(app)
      .delete("/api/comments/99")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });

  test("400: Bad request error if comment_id is invalid", () => {
    return request(app)
      .delete("/api/comments/ten")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe('GET /api/users/', () => {
  test('should return an array with the correct number of user objects', () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body}) => {
      expect(Array.isArray(body.users)).toBe(true);
      expect(body.users.length).toEqual(4)
  })
})

  test('each user object should have the relevant properties', () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then((response) => {
      const users = response.body.users;
        users.forEach((user) => {
          expect(user).toEqual({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          });
        });
      })
    });

    test('error when endpoint is spelt incorrectly', () => {
      return request(app)
      .get("/api/userz")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
    })
  });
