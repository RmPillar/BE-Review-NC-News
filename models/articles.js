const connection = require('../db/connection');

exports.fetchArticles = (
  sort_by = 'created_at',
  order = 'desc',
  author,
  topic,
  limit = 10,
  p = 1
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
    .limit(limit)
    .offset(p * limit - limit);
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

exports.updateVoteById = (article_id, inc_votes = 0) => {
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
        } else return article[0];
      });
};

exports.checkUserExists = author => {
  return connection('users')
    .select('*')
    .modify(query => {
      if (author) query.where('username', author);
    })
    .then(([author]) => {
      if (!author) {
        return Promise.reject({
          status: 404,
          msg: 'Author Not Found'
        });
      }
    });
};

exports.checkTopicExists = topic => {
  return connection('topics')
    .select('*')
    .modify(query => {
      if (topic) query.where('slug', topic);
    })
    .then(topic => {
      if (!topic)
        return Promise.reject({ status: 404, msg: 'Topic Not Found' });
    });
};
