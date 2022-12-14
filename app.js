const express = require("express");

const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json())

const {getTopics, getUsers, getArticles, getArticleByID, patchArticleByID, getCommentsFromArticleByID, postCommentsByArticleID, deleteCommentByID} = require("./controllers/controller");

const endpoints = require('./endpoints.json')

app.get("/", (req, res) => {
  res.status(200).send(endpoints)
})

//Topics
app.get("/api/topics", getTopics);


// Users
app.get("/api/users", getUsers);


// Articles
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleByID);
app.patch("/api/articles/:article_id", patchArticleByID);


// Comments 
app.get("/api/articles/:article_id/comments", getCommentsFromArticleByID);
app.post("/api/articles/:article_id/comments",postCommentsByArticleID)
app.delete("/api/comments/:comment_id", deleteCommentByID)


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