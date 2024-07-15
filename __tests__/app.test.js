const request = require("supertest");
const app = require("../app");
const db = require("../db/connection")
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index")
const endpoints =require("../endpoints.json")

beforeAll(() => seed(data));
afterAll(() => db.end());

describe('GET API topics', () => {
    it('should respond with an array of topic objects', () => {
        return request(app)
        .get("/api/topics/")
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.topics)).toBe(true)
        })
    });
        it("each topic object should include a 'slug' and 'description' property", () => {
          return request(app)
            .get("/api/topics/")
            .expect(200)
            .then(({body}) => {
              body.topics.forEach((topic) => {
                expect(topic).toEqual({
                  slug: expect.any(String),
                  description: expect.any(String),
                });
              });
            });
})
})

