const { fetchTopics, fetchArticleByID, fetchUsers } = require("../models/model");

exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then((topics) => {
        res.status(200).send({ topics });
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

exports.getUsers = (req, res, next) => {
    fetchUsers()
    .then((users) => {
        res.status(200).send({ users });
  })
  .catch(next)
};

exports.patchArticleByID = (req, res, next) => {
    const {article_id} = req.params
    fetchArticleByID(article_id)
    .then((article) => {
        res.status(200).send({ article });
  })
  .catch(next)
};