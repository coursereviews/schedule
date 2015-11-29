'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const expressValidator = require('express-validator');
const exphbs = require('express-handlebars');
const passport = require('passport');
const path = require('path');

const settings = require('./settings');
const Bookshelf = require('./settings/db');
require('./settings/passport');


const app = express();

app.set('port', process.env.PORT || 3300);
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, '../public')));
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: app.get('views') + '/layouts',
  partialsDir: app.get('views') + '/partials',
}));
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expressValidator());
app.use(session({
  secret: 'middcourses_secret',
  cookie: {maxAge: 7 * 24 * 60 * 60 * 1000}, // 1 week
  store: new KnexSessionStore({tablename: 'sessions', knex: Bookshelf.knex}),
}));
app.use(passport.initialize());
app.use(passport.session());

require('./routes')(app);


// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500).send({
    message: err.message,
    error: err,
  });
});


app.listen(settings.port);
console.log('Listening on port', settings.port);
