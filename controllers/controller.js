const {fetchTopics, fetchUsers, fetchArticles ,fetchArticleByID, fetchCommentsFromArticleByID, fetchAndPatchArticleByID, fetchAndPostCommentsByArticleID, } = require("../models/model");


exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
  })
  .catch(next)
};


exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
   })
  .catch(next)
};


exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((article) => {
      res.status(200).send({ article });
   })
  .catch(next)
};


exports.getArticleByID = (req, res, next) => {
  const {article_id} = req.params
  fetchArticleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
   })
  .catch(next)
};


exports.getCommentsFromArticleByID = (req, res, next) => {
  const {article_id} = req.params
  fetchCommentsFromArticleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
   })
  .catch(next)
};


exports.patchArticleByID = (req, res, next) => {
  const {article_id} = req.params
  const {inc_votes} = req.body
  fetchAndPatchArticleByID(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
   })
  .catch(next)
};


exports.postCommentsByArticleID = (req, res, next) => {
  const {article_id} = req.params
  const username = req.body.username
  const body = req.body.body
  fetchAndPostCommentsByArticleID(article_id, username, body)
    .then((article) => {
      res.status(201).send({ article });
   })
  .catch(next)
};