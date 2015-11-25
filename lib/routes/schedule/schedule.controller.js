/* global -Promise */

'use strict';

const path = require('path');
const fs = require('fs');

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
    new Schedule({id: req.params.id}).fetch({withRelated: ['user']}),
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
  var sID = req.body[constants.SCHEDULE_ID];
  // assuming ids are unique
  var scheduleJSON = getScheduleJSON();
  scheduleJSON[constants.SCHEDULE].forEach(function(item) {
    if (item[constants.SCHEDULE_ID] === sID) {
      var fields = req.body;
      for (var i in fields) {
        item[i] = fields[i];
      }
    }
  });
  res.send(scheduleJSON);
};

// delete base on the id
exports.deleteSchedule = function(req, res) {
  var sID = req.body[constants.SCHEDULE_ID];
  // assuming ids are unique
  var scheduleJSON = getScheduleJSON();
  for (var i = 0; i < scheduleJSON[constants.SCHEDULE].length; i += 1) {
    if (scheduleJSON[constants.SCHEDULE][i][constants.SCHEDULE_ID] === sID) {
      scheduleJSON[constants.SCHEDULE].splice(i, 1);
    }
  }
  res.send(scheduleJSON);
};

var getSchedulesByValue = function(key, value) {
  var scheduleJSON = getScheduleJSON();
  var resultArray = [];
  scheduleJSON[constants.SCHEDULE].forEach(function(item) {
    if (item[key] === value) {
      resultArray.push(item);
    }
  });
  return resultArray;
};
