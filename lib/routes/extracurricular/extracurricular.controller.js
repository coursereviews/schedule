/* global -Promise */

'use strict';

const Promise = require('bluebird');
const User = require('../../models/user');
const ExtraCurricular = require('../../models/extracurricular');

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
  Promise.join(req.user.fetch(),
               new ExtraCurricular({id: req.params.id}).fetch({withRelated: ['user']}),
  function(user, ec) {
    if (!ec || ec.related('user').get('id') !== user.get('id')) {
      throw new ExtraCurricular.NotFoundError();
    }

    res.send(ec.toJSON());
  })
  .catch(ExtraCurricular.NotFoundError, function() {
    res.status(404).send('Not found.');
  });
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
  Promise.join(req.user.fetch(),
               new ExtraCurricular({id: req.params.id}).fetch({withRelated: ['user']}),
  function(user, ec) {
    if (!ec || ec.related('user').get('id') !== user.get('id')) {
      throw new ExtraCurricular.NotFoundError();
    }

    return ec.set(req.body).save();
  })
  .then(function(ec) {
    res.send(ec.toJSON());
  })
  .catch(ExtraCurricular.NotFoundError, function() {
    res.status(404).send('Not found.');
  });
};

exports.deleteExtraCurricular = function(req, res) {
  Promise.join(req.user.fetch(),
               new ExtraCurricular({id: req.params.id}).fetch({withRelated: ['user']}),
  function(user, ec) {
    if (!ec || ec.related('user').get('id') !== user.get('id')) {
      throw new ExtraCurricular.NotFoundError();
    }

    return ec.destroy();
  })
  .then(function() {
    res.send('OK');
  })
  .catch(ExtraCurricular.NotFoundError, function() {
    res.status(404).send('Not found.');
  });
};
