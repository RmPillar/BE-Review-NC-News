const connection = require('../db/connection');

exports.fetchArticleById = article_id => {
  return connection('articles')
    .select('*')
    .where({ article_id })
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Article Not Found'
        });
      } else return article;
    });
};
