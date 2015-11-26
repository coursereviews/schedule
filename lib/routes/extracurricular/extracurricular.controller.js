'use strict';

const User = require('../../models/user');

exports.getAllExtraCurriculars = function(req, res) {
  req.user.fetch({withRelated: ['extraCurriculars']})
  .then(function(user) {
    if (!user) {
      throw new User.NotFoundError();
    }

    res.send(user.related('extraCurriculars').toJSON());
  })
  .catch(User.NotFoundError, function() {
    res.status(404).send('Not found.');
  });
};

exports.getExtraCurricular = function(req, res) {

};

exports.createExtraCurricular = function(req, res) {
  req.user.fetch()
  .then(function(user) {
    if (!user) {
      throw new User.NotFoundError();
    }

    return user.related('extraCurriculars').create(req.body);
  })
  .then(function(extraCurricular) {
    res.send(extraCurricular.toJSON());
  })
  .catch(User.NotFoundError, function() {
    res.status(404).send('Not found.');
  });
};

exports.updateExtraCurricular = function(req, res) {

};

exports.deleteExtraCurricular = function(req, res) {

};
