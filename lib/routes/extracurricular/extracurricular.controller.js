/* global -Promise */

'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
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
  validateExtracurricular(req);

  const errors = req.validationErrors();
  if (errors) {
    return res.json(_.assign(req.body, {errors: errors}));
  }

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
  validateExtracurricular(req);

  const errors = req.validationErrors();
  if (errors) {
    return res.json(_.assign(req.body, {errors: errors}));
  }

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

function validateExtracurricular(req) {
  req.validate('name', 'Name is required.').notEmpty();
  req.validate('start_time', 'Start time is required.').notEmpty();
  req.validate('start_time', 'Times need to be in a format like 6:05pm.').isTime();
  req.validate('end_time', 'End time is required.').notEmpty();
  req.validate('end_time', 'Times need to be in a format like 6:05pm.').isTime();
  req.validate('end_time', 'End time needs to come after start time.').isAfter(req.body.start_time);
  req.validate('days', 'Days of the week is a required field.').notEmpty();
}
