const usersRouter = require('express').Router();
const { getUserById } = require('../controllers/users');
const { handle405s } = require('../errors/');

usersRouter
  .route('/:username')
  .get(getUserById)
  .all(handle405s);

module.exports = usersRouter;
