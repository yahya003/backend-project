const express = require("express");
const app = express();
app.use(express.json())

const {getTopics} = require("./controllers/controller");

app.get("/api/topics", getTopics);

app.all((err, req, res, next) => {
    res.status(404).send("Route not found!")
})

app.use((err, req, res, next) => {
  if (err) console.log(err.status)
  else next()
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: "Something went wrong"})
  })


module.exports = app;
