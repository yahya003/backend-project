const express = require("express");
const app = express();

const {getTopics,getArticleByID} = require("./controllers/controller");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleByID);


  app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  });
  
  app.use((err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send({ msg: 'Invalid input' });
    } else next(err);
  });
  
  app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  });


module.exports = app;
