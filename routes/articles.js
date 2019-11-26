const articlesRouter = require('express').Router();
const { getArticleById, patchArticleById } = require('../controllers/articles');
const {
  postComment,
  getCommentsByArticleId
} = require('../controllers/comments');

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articlesRouter;
