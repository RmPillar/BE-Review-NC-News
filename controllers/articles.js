const {
  fetchArticles,
  fetchArticleById,
  updateVoteById,
  checkUserExists,
  checkTopicExists
} = require('../models/articles');

exports.getArticles = (req, res, next) => {
  let { sort_by, order, author, topic, limit, p } = req.query;
  if (!limit) limit = 10;
  if (!p) p = 1;
  const articlesQuery = fetchArticles(sort_by, order, author, topic, limit, p);
  const limitedArticlesQuery = articlesQuery
    .clone()
    .limit(limit)
    .offset(p * limit - limit);

  const promiseArr = [limitedArticlesQuery, articlesQuery];
  if (topic) promiseArr.push(checkTopicExists(topic));
  if (author) promiseArr.push(checkUserExists(author));

  Promise.all(promiseArr)
    .then(([articles, count]) => {
      const totalCount = count.length;
      res.status(200).send({ articles, totalCount });
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
