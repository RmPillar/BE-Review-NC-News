const connection = require('../db/connection');

exports.fetchUserById = username => {
  console.log(username);
  return connection('users')
    .select('*')
    .where({ username });
};
