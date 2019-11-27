const connection = require('../db/connection');

exports.createComment = (article_id, body) => {
  const insertion = {
    author: body.username,
    article_id,
    body: body.body
  };

  return connection('comments')
    .insert(insertion)
    .returning('*');
};

exports.fetchCommentsByArticleId = (
  article_id,
  sort_by = 'created_at',
  order = 'desc'
) => {
  return connection('comments')
    .select('*')
    .where({ article_id })
    .orderBy(sort_by, order)
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Article Not Found'
        });
      } else return comments;
    });
};
