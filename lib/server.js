'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');

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
app.use('/', express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'middcourses_private_secret',
}));

require('./routes')(app);


// connect to DB -- more work to be done here
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './db/main.db',
  },
});

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
