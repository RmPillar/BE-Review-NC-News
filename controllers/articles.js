const {
  fetchArticles,
  fetchArticleById,
  updateVoteById
} = require('../models/articles');

exports.getArticles = (req, res, next) => {
  console.log(req.query);
  const { sort_by, order, author, topic, limit } = req.query;
  fetchArticles(sort_by, order, author, topic, limit)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  updateVoteById(article_id, inc_votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};
