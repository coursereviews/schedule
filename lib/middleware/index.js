'use strict';

module.exports = function(app) {

  app.use(function(req, res, next) {

    app.locals = {
      user: req.user
    };

    next();
  });

};
