const articlesRouter = require('express').Router();
const {
  getArticles,
  getArticleById,
  patchArticleById
} = require('../controllers/articles');
const {
  postComment,
  getCommentsByArticleId
} = require('../controllers/comments');

const { handle405s } = require('../errors/');

articlesRouter
  .route('/')
  .get(getArticles)
  .all(handle405s);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById)
  .all(handle405s);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postComment)
  .all(handle405s);

module.exports = articlesRouter;
