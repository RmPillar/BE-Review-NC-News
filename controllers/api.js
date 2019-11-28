const { fetchAllEndPoints } = require('../models/api');

exports.getAllEndPoints = (req, res, next) => {
  fetchAllEndPoints()
    .then(endPoints => {
      res.status(200).send({ endPoints });
    })
    .catch(next);
};
