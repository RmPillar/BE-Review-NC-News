const { fetchArticleById, updateArticleById } = require('../models/articles');

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { inc_vote } = req.body;
  const { article_id } = req.params;
  updateArticleById(article_id, inc_vote)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};
