const {fetchTopics, fetchUsers, fetchArticles ,fetchArticleByID, fetchCommentsFromArticleByID, fetchAndPatchArticleByID, addCommentByArticleID,fetchAndDeleteCommentByID } = require("../models/model");


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
  const sort_by = req.query.sort_by
  const order = req.query.order
  const topic = req.query.topic
  fetchArticles(sort_by, order, topic)
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
    .then((comments) => {
      res.status(200).send({ comments });
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
  addCommentByArticleID(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
   })
  .catch(next)
};


exports.deleteCommentByID = (req, res, next) => {
  const {comment_id} = req.params
  fetchAndDeleteCommentByID(comment_id)
    .then(() => {
      res.status(204).send();
   })
  .catch(next)
};