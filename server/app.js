const path = require('path');
require('dotenv')
  .config({
    path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`)
  });
const express = require('express');
const hbs = require('express-handlebars');
const reqMiddleware = require('./middlewares/index');
const { dynamicRoutes } = require('./constants');

const app = express();

const PORT = 8000;

app.use(express.static(path.resolve(__dirname, '../build')));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
  extname: 'hbs',
}));

app.use(dynamicRoutes, reqMiddleware);
app.use('*', reqMiddleware);

app.listen(PORT, _ => {
  console.log('OK, port is ', PORT);
});
