const { createComment } = require('../models/comments');

exports.postComment = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;
  createComment(article_id, body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
