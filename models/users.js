const connection = require('../db/connection');

exports.fetchUserByUsername = username => {
  return connection('users')
    .select('*')
    .where({ username })
    .then(([user]) => {
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: 'User Not Found'
        });
      } else return user;
    });
};
