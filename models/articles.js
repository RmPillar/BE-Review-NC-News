const connection = require('../db/connection');

exports.fetchAllArticles = () => {
  return connection('articles').select('*');
};

exports.fetchArticleById = article_id => {
  return connection('articles')
    .select('articles.*')
    .count({ comment_count: 'comments' })
    .where('articles.article_id', article_id)
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Article Not Found'
        });
      } else return article[0];
    });
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
