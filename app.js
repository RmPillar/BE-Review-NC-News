const express = require('express');
const app = express();
const apiRouter = require('./routes/api');
const { handle404s, handle500s } = require('./errors');

app.use(express.json());
app.use('/api', apiRouter);

app.all('/*', handle404s);
app.use(handle500s);

module.exports = app;
