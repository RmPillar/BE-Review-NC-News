const usersRouter = require('express').Router();
const { getUserById } = require('../controllers/users');

usersRouter.route('/:username').get(getUserById);

module.exports = usersRouter;
