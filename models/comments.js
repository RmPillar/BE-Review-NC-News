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

exports.fetchCommentsByArticleId = article_id => {
  return connection('comments')
    .select('*')
    .where({ article_id });
};
