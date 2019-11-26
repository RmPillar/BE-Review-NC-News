const connection = require('../db/connection');

exports.fetchUserById = username => {
  // console.log(username);
  return connection('users')
    .select('*')
    .where({ username })
    .then(user => {
      if (user.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'User Not Found'
        });
      } else return user;
    });
};
