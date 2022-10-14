const express = require("express");
const app = express();
app.use(express.json())
const {getTopics,getArticleByID, getUsers, patchArticleByID, getArticles} = require("./controllers/controller");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/users", getUsers);
app.patch("/api/articles/:article_id", patchArticleByID);
app.get("/api/articles", getArticles);


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


module.exports = app;