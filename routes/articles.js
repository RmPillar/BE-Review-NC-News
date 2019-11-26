const articlesRouter = require('express').Router();
const { getArticleById, patchArticleById } = require('../controllers/articles');
const { postComment } = require('../controllers/comments');

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter.route('/:article_id/comments').post(postComment);

module.exports = articlesRouter;
