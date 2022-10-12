const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const { response } = require("../app");
beforeEach(() => {
    return seed(data);
  });
afterAll(() => {
  return db.end();
});

describe("3. GET: /api/topics", () => {
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
  })


  describe("4. and 7. GET: /api/articles/:article_id (comments_count)", () => {
    test("200: responds with correct (updated) article with comments_count", () => {
     return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const {
          body: { article },
        } = response;
        expect(article).toEqual({"article_id": 1, "author": "butter_bridge", "body": "I find this existence challenging", "comment_count": 11, "created_at": "2020-07-09T20:11:00.000Z", "title": "Living in the shadow of a great man", "topic": "mitch", "votes": 100})
    })
  })
    test("400: responds with error for an incorrect route", () => {
          return request(app)
           .get("/api/articles/notAvailable")
           .expect(400)
           .then(({body})=> {
            expect(body.msg).toBe("Bad Request")
          })
    })

    test("404: responds with error for a route that is not available although is valid", () => {
        return request(app)
          .get("/api/articles/200")
          .expect(404)
          .then(({body})=> {
            expect(body.msg).toBe("This article does not exist")
          })
    })
    
    test("400: responds with error for bad request", () => {
        return request(app)
         .get("/api/articles/whereAreYou")
         .expect(400)   
      .then(({body})=> {
        expect(body.msg).toBe("Bad Request")
      })
    })
  })
  
  
describe("5. GET: /api/users", () => {
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
      

})

describe('6. PATCH /api/articles/:article_id  ', () => {
test("200: responds with updated votes", () => {
  const newVote = {
    inc_votes: 3
  }
  return request(app)
    .patch("/api/articles/6")
    .send(newVote)
    .expect(200)
    .then((response) => {
      const {
        body: { article },
      } = response;
      expect(article).toEqual(
        {"article_id": 6, "author": "icellusedkars", "body": "Delicious tin of cat food", "created_at": "2020-10-18T01:00:00.000Z", "title": "A", "topic": "mitch", "votes": 3}
      )
  })
 })
 test("200: responds with updated votes even when inc_votes is negative", () => {
  const newVote = {
    inc_votes: -5
  }
  return request(app)
    .patch("/api/articles/6")
    .send(newVote)
    .expect(200)
    .then((response) => {
      const {
        body: { article },
      } = response;
      expect(article).toEqual(
        {"article_id": 6, "author": "icellusedkars", "body": "Delicious tin of cat food", "created_at": "2020-10-18T01:00:00.000Z", "title": "A", "topic": "mitch", "votes": -5}
      )
  })
 })
 test("400: responds with invalid input for a bad request", () => {
  const newVote = {
    inc_votes: 3
  }
  return request(app)
    .patch("/api/articles/biij")
    .send(newVote)
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe("Bad Request")
    })
 })

 test("404: responds with not found error if the article doesn't exist but the entry is valid", () => {
  const newVote = {
    inc_votes: 3
  }
  return request(app)
    .patch("/api/articles/1000")
    .send(newVote)
    .expect(404)
    .then(({body})=> {
      expect(body.msg).toBe("This data does not exist")
    })
 })
})



describe("8. GET: /api/articles", () => {
  
  test("200: responds with correct content keys", () => {
   return request(app)
    .get("/api/articles")
    .expect(200)
    .then((response) => {
      let {
        _body: {article}
      } = response
          article.forEach((eachArticle) => {
            expect(eachArticle).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            )
           })
          })
        })

        test("200: responds with all articles if none speciifed ", () => {
          return request(app)
           .get("/api/articles")
           .expect(200)
           .then((response) => {
             let {
               _body: {article}
             } = response
                 expect(article).toEqual([{"article_id": 3, "author": "icellusedkars", "body": "some gifs", "comment_count": 2, "created_at": "2020-11-03T09:12:00.000Z", "title": "Eight pug gifs that remind me of mitch", "topic": "mitch", "votes": 0}, {"article_id": 6, "author": "icellusedkars", "body": "Delicious tin of cat food", "comment_count": 1, "created_at": "2020-10-18T01:00:00.000Z", "title": "A", "topic": "mitch", "votes": 0}, {"article_id": 5, "author": "rogersop", "body": "Bastet walks amongst us, and the cats are taking arms!", "comment_count": 2, "created_at": "2020-08-03T13:14:00.000Z", "title": "UNCOVERED: catspiracy to bring down democracy", "topic": "cats", "votes": 0}, {"article_id": 1, "author": "butter_bridge", "body": "I find this existence challenging", "comment_count": 11, "created_at": "2020-07-09T20:11:00.000Z", "title": "Living in the shadow of a great man", "topic": "mitch", "votes": 100}, {"article_id": 9, "author": "butter_bridge", "body": "Well? Think about it.", "comment_count": 2, "created_at": "2020-06-06T09:10:00.000Z", "title": "They're not exactly dogs, are they?", "topic": "mitch", "votes": 0}])
          })
        })

        test("200: responds with filtered articles by topic ", () => {
          return request(app)
           .get("/api/articles?topic=cats")
           .expect(200)
           .then((response) => {
             let {
               _body: {article}
             } = response
                 expect(article).toEqual([{"article_id": 5, "author": "rogersop", "body": "Bastet walks amongst us, and the cats are taking arms!", "comment_count": 2, "created_at": "2020-08-03T13:14:00.000Z", "title": "UNCOVERED: catspiracy to bring down democracy", "topic": "cats", "votes": 0}
            ])
          })
        })

        
  test("200: responds with articles in descending order", () => {
    return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response)=> {
          const {
            _body: { article },
          } = response;
          expect(article).toBeSortedBy(`created_at`, {
            descending: true
          })
        })
      })

    test("404: responds with an error for a valid but not available request", () => {
      return request(app)
          .get("/api/articles?topic=tiger")
          .expect(404)
            .then(({body})=> {
              expect(body.msg).toBe("The endpoint does not exist")
            })
          })
        })
         

    describe("Path entered doesn't match an existing path", () => {
      test("404: responds with error for a route that is not available", () => {
      return request(app)
        .get("/api/user")
        .expect(404)
        .then(({body})=> {
          expect(body.msg).toBe("The endpoint does not exist")
        })
      })
    })

  