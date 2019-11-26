exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handle400s = (err, req, res, next) => {
  console.log(err);
  res.status(400).send({ msg: 'Bad Request!!' });
};

// error controllers

exports.handle404s = (req, res, next) => {
  res.status(404).send({ msg: 'Path not found!!' });
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal Server Error' });
};
