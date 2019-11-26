const {
  createComment,
  fetchCommentsByArticleId
} = require('../models/comments');

exports.postComment = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;
  createComment(article_id, body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
