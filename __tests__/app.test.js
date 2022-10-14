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
        slug: "paper",}])
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
        expect(article).toEqual({"article_id": 1, "author": "butter_bridge", "body": "I find this existence challenging", "comment_count": "11", "created_at": "2020-07-09T20:11:00.000Z", "title": "Living in the shadow of a great man", "topic": "mitch", "votes": 100})
    })
  })

    test("404: responds with error for a route that is not available although is valid", () => {
        return request(app)
          .get("/api/articles/200")
          .expect(404)
          .then(({body})=> {
            expect(body.msg).toBe("Article not found")
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

describe('6. PATCH: /api/articles/:article_id  ', () => {
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
      expect(body.msg).toBe("Article not found")
    })
 })
})



describe("8. and 11. GET: /api/articles", () => {
  
  test("200: responds with correct content keys", () => {
   return request(app)
    .get("/api/articles")
    .expect(200)
    .then((response) => {
      let {
        _body: articles
      } = response
      articles = articles.article
      if (articles.length == 0) {
        return Promise.reject({status: 404, msg: "This article does not exist"})
      }
      else{
          articles.forEach((article) => {
            expect(article).toEqual(
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
          }
          })
        })
        
  test("200: responds with articles in descending order by date", () => {
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
      test("200: responds with articles in ascending order by a chosen filter", () => {
        return request(app)
            .get("/api/articles?sort_by=article_id&order=ASC")
            .expect(200)
            .then((response)=> {
              const {
                _body: { article },
              } = response;
              expect(article).toBeSortedBy(`article_id`, {
                ascending: true
              })
            })
          })
          
        })
  


    describe("9. GET: /api/articles/:article_id/comments", () => {
      test("200: responds with correct comments", () => {
       return request(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then((response) => {
          const {
            body: { comments },
          } = response;
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            )
           })
         })
        })
    

      test("200: responds with the comments in descending order by date", () => {
        return request(app)
         .get("/api/articles/5/comments")
         .expect(200)
         .then((response) => {
           const {
             body: { comments },
           } = response;
           expect(comments).toBeSortedBy(`created_at`, {
             descending: true
           })
         })
       })
       test("200: Responds if article exists but has no comments linked", () => {
        return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((response) => {
          const {
            body: { comments },
          } = response;
          expect(comments).toEqual([])
        })
        })
        test("404: Error if article_id does not exist but is valid", () => {
          return request(app)
          .get("/api/articles/200/comments")
          .expect(404)
          .then(({body}) => {
            expect(body.msg).toEqual("Article not found")
          })
          })
      })

    describe("10. POST /api/articles/:article_id/comments",() => {
    test("201: responds with newly created comment", () => {
      const newComment = {
        username: 'icellusedkars',
        body: 'This is impossible'
      }
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then((response => {
          const {
            body: { comment },
          } = response
          expect(comment).toEqual(
            expect.objectContaining({
              "article_id": 1,
              "author": "icellusedkars",
              "body": "This is impossible",
              "comment_id": 19,
              "created_at": expect.any(String),
              "votes": 0,
            })
          )
        }))
      })
      test("400: responds with error for a route that has the wrong data type", () => {
        const newComment = {
          username: 'icellusedkars',
          body: 'This is impossible'
        }
        return request(app)
          .post("/api/articles/huh/comments")
          .send(newComment)
          .expect(400)
          .then(({body})=> {
            expect(body.msg).toBe("Bad Request")
          })
        })

        test("404: Error if article_id does not exist but is valid", () => {
          const newComment = {
            username: 'icellusedkars',
            body: 'This is impossible'
          }
          return request(app)
          .post("/api/articles/200/comments")
          .send(newComment)
          .expect(404)
          .then(({body}) => {
            expect(body.msg).toEqual("Article not found")
          })
          })
    })


    describe('12. DELETE /api/comments/:comment_id', () => {
    test("204: deletes article", () => {
      return request(app)
          .delete("/api/comments/1")
          .expect(204)
        })

    test("404: Error if comment_id does not exist but is valid", () => {
          return request(app)
          .delete("/api/comments/200")
          .expect(404)
          .then(({body}) => {
            expect(body.msg).toEqual("Comment not found")
          })
          })

    test("400: Error if comment_id is NaN", () => {
            return request(app)
            .delete("/api/comments/hello")
            .expect(400)
            .then(({body}) => {
              expect(body.msg).toEqual("Bad Request")
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
      });
    })

