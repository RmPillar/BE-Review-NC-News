const connection = require('../db/connection');

exports.fetchArticleById = article_id => {
  const articlePromise = connection('articles')
    .select('*')
    .where({ article_id });
  const commentCountPromise = connection('comments')
    .count('comments as comment_count')
    .where({ article_id });

  return Promise.all([articlePromise, commentCountPromise]).then(article => {
    if (article[0].length === 0) {
      return Promise.reject({
        status: 404,
        msg: 'Article Not Found'
      });
    } else return { ...article[0][0], ...article[1][0] };
  });
};

exports.updateArticleById = (article_id, inc_votes) => {
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
