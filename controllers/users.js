const { fetchUserById } = require('../models/users');

exports.getUserById = (req, res, next) => {
  const { username } = req.params;
  fetchUserById(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};
