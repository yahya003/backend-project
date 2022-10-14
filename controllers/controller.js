const {fetchTopics, fetchUsers, fetchArticles ,fetchArticleByID, fetchCommentsFromArticleByID, fetchAndPatchArticleByID, addCommentByArticleID, } = require("../models/model");


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
  const {inc_votes} = req.body
  fetchAndPatchArticleByID(article_id, inc_votes)
  .then((article) => {
      res.status(200).send({ article });
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


exports.getArticles = (req, res, next) => {
  fetchCommentsFromArticleByID()
  .then((article) => {
      res.status(200).send({ article });
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