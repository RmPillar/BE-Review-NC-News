const usersRouter = require('express').Router();
const { getUserById } = require('../controllers/users');

usersRouter.get('/:username', getUserById);

module.exports = usersRouter;
