'use strict';

const auth = require('../settings/passport');

module.exports = function(app) {

  app.use('/', require('./base'));
  app.use('/api/catalog', auth.requireAuth, require('./catalog'));
  app.use('/api/schedule', auth.requireAuth, require('./schedule'));


  app.route('/:url(api|auth|components|app|bower_components|assets)/*', function(req, res) {
    var viewFilePath = '404';
    var statusCode = 404;
    var result = {
      status: statusCode,
    };

    res.status(result.status);
    res.render(viewFilePath, function(err) {
      if (err) {
        return res.json(result, result.status);
      }

      res.render(viewFilePath);
    });
  });

  // All other routes should redirect to the index.html
  app.route('/*').get(function(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect('/login');
    }
    res.redirect('/');
  });
};
