const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
beforeEach(() => {
    return seed(data);
  });
afterAll(() => {
  return db.end();
});

describe("GET: /api/topics", () => {
  test("200: responds with correct topics", () => {
   return request(app)
    .get("/api/topics")
    .expect(200)
    .then((response) => {
      const {
        body: { topics },
      } = response;
      expect(topics).toEqual([{
        description: "The man, the Mitch, the legend",
        slug: "mitch",
      },
      {
        description: "Not dogs",
        slug: "cats",
      },
      {
        description: "what books are made of",
        slug: "paper",
      }])
        })
    })

    test("404: responds with error for an incorrect route", () => {
        return request(app)
         .get("/api/topic")
         .expect(404)
    })
  })


                  