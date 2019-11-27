const connection = require('../db/connection');

exports.createComment = (article_id, body) => {
  const insertion = {
    author: body.username,
    article_id,
    body: body.body
  };
  return connection('comments')
    .insert(insertion)
    .returning('*')
    .then(comment => comment[0]);
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

exports.updateCommentVote = (comment_id, inc_votes) => {
  if (typeof inc_votes === 'string') {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request!!'
    });
  } else
    return connection('comments')
      .increment('votes', inc_votes)
      .where({ comment_id })
      .returning('*')
      .then(comment => {
        if (comment.length === 0) {
          return Promise.reject({
            status: 404,
            msg: 'Comment Not Found'
          });
        } else return comment[0];
      });
};

exports.removeCommentById = comment_id => {
  return connection('comments')
    .where({ comment_id })
    .del();
};
