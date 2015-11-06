'use strict';


const express = require('express');
const path = require('path');

const routes = require('./routes');
const settings = require('./settings');


const app = express();


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
// app.use('/users', users);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {},
  });
});


app.listen(settings.port);
console.log('listening on port ', settings.port);
