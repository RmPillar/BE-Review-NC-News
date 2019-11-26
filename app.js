const express = require('express');
const app = express();
const apiRouter = require('./routes/api');
const { handle404s } = require('./errors');

app.use(express.json());
app.use('/api', apiRouter);

app.all('/*', handle404s);

module.exports = app;
