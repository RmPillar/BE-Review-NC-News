const {
  fetchArticles,
  fetchArticleById,
  updateVoteById,
  checkUserExists,
  checkTopicExists
} = require('../models/articles');

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic, limit, p } = req.query;
  const promiseArr = [fetchArticles(sort_by, order, author, topic, limit, p)];
  if (topic) promiseArr.push(checkTopicExists(topic));
  if (author) promiseArr.push(checkUserExists(author));

  Promise.all(promiseArr)
    .then(articles => {
      res.status(200).send({ articles: articles[0] });
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
