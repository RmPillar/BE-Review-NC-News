const apiRouter = require('express').Router();
const topicsRouter = require('./topics');
const usersRouter = require('./users');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
