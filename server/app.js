const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const { sequelize } = require('./db/models');
const indexRouter = require('./routes/index');

dotenv.config();

const app = express();
sequelize.sync();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);

app.get('*', (_, res) => {
  res.sendFile('/index.html');
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send('Server Error Occured..');
});

app.listen(process.env.PORT || 5000, () => {
  console.log('server is listening 5000 port');
});

module.exports = app;
