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
