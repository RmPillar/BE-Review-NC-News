const connection = require('../db/connection');

exports.fetchArticles = (
  sort_by = 'created_at',
  order = 'desc',
  author,
  topic
) => {
  return connection('articles')
    .select(
      'articles.author',
      'title',
      'articles.article_id',
      'topic',
      'articles.created_at',
      'articles.votes'
    )
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .modify(query => {
      if (author) query.where('articles.author', author);
      if (topic) query.where('articles.topic', topic);
    })
    .orderBy(sort_by, order)
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Query Not Found'
        });
      } else return articles;
    });
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
