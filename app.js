const express = require("express");
const app = express();
app.use(express.json())
const {getTopics, getUsers, getArticles, getArticleByID, patchArticleByID, getCommentsFromArticleByID, postCommentsByArticleID} = require("./controllers/controller");


//Topics
app.get("/api/topics", getTopics);


// Users
app.get("/api/users", getUsers);


// Articles
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles/:article_id/comments", getCommentsFromArticleByID);
app.post("/api/articles/:article_id/comments",postCommentsByArticleID)
app.patch("/api/articles/:article_id", patchArticleByID);



// Error Handling

app.all(`/*`,(req, res) => {
  res.status(404).send({msg: "The endpoint does not exist"})
})

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});
  
app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad Request' });
  } else next(err);
});
  
app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
});

// Error Handling


module.exports = app;
