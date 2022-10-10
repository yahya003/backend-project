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


  describe("GET: /api/articles/:article_id", () => {
    test("200: responds with correct article", () => {
     return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const {
          body: { article },
        } = response;
        expect(article).toEqual({"article_id": 1, "author": "butter_bridge", "body": "I find this existence challenging", "created_at": "2020-07-09T20:11:00.000Z", "title": "Living in the shadow of a great man", "topic": "mitch", "votes": 100})
      })
    })
  
    test("404: responds with error for an incorrect route", () => {
          return request(app)
           .get("/api/articl/1")
           .expect(404)
    })

    test("404: responds with error for a route that is not available although is valid", () => {
        return request(app)
          .get("/api/articles/200")
          .expect(404)
                  })
    
    test("400: responds with error for bad request", () => {
        return request(app)
         .get("/api/articles/whereAreYou")
         .expect(400)
      })
    })
  
  
describe("GET: /api/users", () => {
  test("200: responds with correct users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const {
          body: { users },
        } = response;
        expect(users).toEqual([
        {
          username: 'butter_bridge',
          name: 'jonny',
          avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
        },
        {
          username: 'icellusedkars',
          name: 'sam',
          avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
        },
        {
          username: 'rogersop',
          name: 'paul',
          avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
        },
        {
          username: 'lurker',
          name: 'do_nothing',
          avatar_url:
                    'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
        }
      ])
    })
  })
      
  test("404: responds with error for an incorrect route", () => {
    return request(app)
      .get("/api/user")
      .expect(404)
    })
})
      