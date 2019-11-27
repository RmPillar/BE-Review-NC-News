const connection = require('../db/connection');

exports.fetchArticleById = article_id => {
  return connection('articles')
    .select('articles.*')
    .count({ comment_count: 'comments' })
    .where('articles.article_id', article_id)
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .then(article => {
      if (article[0].length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Article Not Found'
        });
      } else return article[0];
    });

  // const commentCountPromise = connection('comments')
  //   .count('comments as comment_count')
  //   .where({ article_id });

  // return Promise.all([articlePromise, commentCountPromise]).then(article => {
  //   if (article[0].length === 0) {
  //     return Promise.reject({
  //       status: 404,
  //       msg: 'Article Not Found'
  //     });
  //   } else return { ...article[0][0], ...article[1][0] };
  // });
};

exports.updateVoteById = (article_id, inc_votes) => {
  if (typeof inc_votes === 'string') {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request!!'
    });
  } else
    return connection('articles')
      .increment('votes', inc_votes)
      .where({ article_id })
      .returning('*')
      .then(article => {
        if (article.length === 0) {
          return Promise.reject({
            status: 404,
            msg: 'Article Not Found'
          });
        } else return article;
      });
};
