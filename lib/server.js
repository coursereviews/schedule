'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const exphbs = require('express-handlebars');
const passport = require('passport');
const path = require('path');
const session = require('express-session');

const settings = require('./settings');


const app = express();


app.set('port', process.env.PORT || 3300);
app.set('views', __dirname + '/views');
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: app.get('views') + '/layouts',
}));
app.set('view engine', '.hbs');
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
  secret: 'middcourses_private_secret',
  resave: true,
  saveUninitialized: true,
  store: '',
}));
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, '../public')));


require('./routes')(app);
require('./settings/db');

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {},
  });
});


app.listen(settings.port);
console.log('listening on port ', settings.port);
