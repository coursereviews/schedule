/* global -Promise */

'use strict';

const Promise = require('bluebird');
const Schedule = require('../../models/schedule');

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
      res.send(schedule.toJSON());
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

// update schedule based on schedule id
exports.updateSchedule = function(req, res) {

};

// delete base on the id
exports.deleteSchedule = function(req, res) {

};
