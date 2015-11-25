/* global -Promise */

'use strict';

const Promise = require('bluebird');
const Schedule = require('../../models/schedule');
const _ = require('lodash');

/* GET /api/schedule
 * Get all schedules for a user.
 */
exports.getAllSchedules = function(req, res) {
  req.user
  .fetch({withRelated: ['schedules']})
  .then(function(user) {
    res.send(user.related('schedules').toJSON());
  });
};

/* GET /api/schedule/:id
 * Get a schedule by id. Return 404 if req.user doesn't own the schedule.
 */
exports.getSchedule = function(req, res) {
  Promise.all([
    new Schedule({id: req.params.id})
      .fetch({withRelated: ['user', 'courseOfferings', 'extraCurriculars']}),
    req.user.fetch()
  ])
  .spread(function(schedule, user) {
    if (!schedule || schedule.related('user').get('id') !== user.get('id')) {
      res.status(404).send('Not found.');
    } else {
      res.send(schedule.toJSON({omitPivot: true}));
    }
  });
};


/* POST /api/schedule
 * Create a schedule for the user.
 */
exports.createSchedule = function(req, res) {
  req.user
  .fetch()
  .then(function(user) {
    return user.related('schedules').create(req.body);
  })
  .then(function(schedule) {
    res.send(schedule.toJSON());
  })
  .catch(function(err) {
    res.status(500).send('Server error.');
  });
};

/* PATCH /api/schedule/:id
 * Update a schedule by id, as long as the user owns the schedule.
 *
 * The courseOfferings and extraCurriculars attributes on a schedule to update
 * should be a list of ids to set as the schedule's current course offerings
 * and extra curriculars. Relations that currently exist, and are not listed
 * will be removed.
 */
exports.updateSchedule = function(req, res) {
  Promise.all([
    new Schedule({id: req.params.id})
      .fetch({withRelated: ['user', 'courseOfferings', 'extraCurriculars']}),
    req.user.fetch()
  ])
  .spread(function(schedule, user) {
    if (!schedule || schedule.related('user').get('id') !== user.get('id')) {
      return null;
    }

    return Promise.all([
      schedule.set(_.omit(req.body, ['courseOfferings', 'extraCurriculars'])),

      schedule.related('courseOfferings')
        .detach(_.difference(schedule.related('courseOfferings').pluck('id'),
                             req.body.courseOfferings)),

      schedule.related('courseOfferings')
        .attach(req.body.courseOfferings),

      schedule.related('extraCurriculars')
        .detach(_.difference(schedule.related('extraCurriculars').pluck('id'),
                             req.body.extraCurriculars)),

      schedule.related('extraCurriculars')
        .attach(req.body.extraCurriculars)
    ]);
  })
  .spread(function(schedule) {
    return schedule.fetch({withRelated: ['user', 'courseOfferings', 'extraCurriculars']});
  })
  .then(function(schedule) {
    if (!schedule) {
      res.status(404).send('Not found.');
    } else {
      res.send(schedule.toJSON({omitPivot: true}));
    }
  });
};

// delete base on the id
exports.deleteSchedule = function(req, res) {

};
