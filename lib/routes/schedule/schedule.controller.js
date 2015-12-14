/* global -Promise */
'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

const Schedule = require('../../models/schedule');
const Term = require('../../models/term');
const Bookshelf = require('../../settings/db');


/* GET /api/schedule
 * Get all schedules for a user.
 */
exports.getAllSchedules = function(req, res) {
  req.user
    .fetch({withRelated: ['schedules', 'schedules.term']})
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

function getScheduleSetOps(req, schedule) {
  let scheduleSetOps = [
    schedule.set(_.omit(req.body, ['courseOfferings', 'extraCurriculars'])).save()
  ];

  const currentCourseOfferings = schedule.related('courseOfferings').pluck('id');
  const patchCourseOfferings = (req.body.courseOfferings || []).map(Number);
  const currentExtraCurriculars = schedule.related('extraCurriculars').pluck('id');
  const patchExtraCurriculars = (req.body.extraCurriculars || []).map(Number);

  const courseOfferingsToAttach = _.difference(
    patchCourseOfferings, currentCourseOfferings
  );

  const courseOfferingsToDetach = _.difference(
    currentCourseOfferings, patchCourseOfferings
  );

  const extraCurricularsToAttach = _.difference(
    patchExtraCurriculars, currentExtraCurriculars
  );

  const extraCurricularsToDetach = _.difference(
    currentExtraCurriculars, patchExtraCurriculars
  );

  if (req.body.courseOfferings && courseOfferingsToAttach) {
    scheduleSetOps.push(schedule.related('courseOfferings')
      .attach(courseOfferingsToAttach));
  }

  if (req.body.courseOfferings && courseOfferingsToDetach) {
    scheduleSetOps.push(schedule.related('courseOfferings')
      .detach(courseOfferingsToDetach));
  }


  if (req.body.extraCurriculars && extraCurricularsToAttach) {
    scheduleSetOps.push(schedule.related('extraCurriculars')
      .attach(extraCurricularsToAttach));
  }

  if (req.body.extraCurriculars && extraCurricularsToDetach) {
    scheduleSetOps.push(schedule.related('extraCurriculars')
      .detach(extraCurricularsToDetach));
  }

  return scheduleSetOps;
}

/* POST /api/schedule
 * Create a schedule for the user.
 */
exports.createSchedule = function(req, res) {
  req.user
  .fetch()
  .then(function(user) {
    return user.related('schedules').create(
      _.omit(req.body, 'extraCurriculars', 'courseOfferings')
    );
  })
  .then(function(schedule) {
    return Promise.all(getScheduleSetOps(req, schedule));
  })
  .spread(function(schedule) {
    return schedule.fetch({withRelated: ['user', 'courseOfferings', 'extraCurriculars']});
  })
  .then(function(schedule) {
      res.send(schedule.toJSON({omitPivot: true}));
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).send('Server error.');
  });
};

/* PATCH /api/schedule/:id
 * Update a schedule by id, as long as the user owns the schedule.
 *
 * The courseOfferings and extraCurriculars attributes on a schedule to update
 * should be a list of ids to set as the schedule's current course offerings
 * and extra curriculars. Relations that currently exist, and are not listed
 * will be removed. Sending a PATCH without the courseOfferings or
 * extraCurriculars keys will be a no-op for those relations.
 */
exports.updateSchedule = function(req, res) {
  Promise.all([
    new Schedule({id: req.params.id})
      .fetch({withRelated: ['user', 'courseOfferings', 'extraCurriculars']}),
    req.user.fetch()
  ])
  .spread(function(schedule, user) {
    if (!schedule || schedule.related('user').get('id') !== user.get('id')) {
      throw new Schedule.NotFoundError();
    }

    return Promise.all(getScheduleSetOps(req, schedule));
  })
  .spread(function(schedule) {
    return schedule.fetch({withRelated: ['user', 'courseOfferings', 'extraCurriculars']});
  })
  .then(function(schedule) {
      res.send(schedule.toJSON({omitPivot: true}));
  })
  .catch(Schedule.NotFoundError, function() {
    res.status(404).send('Not found.');
  });
};

/* DELETE /api/schedule/:id
 * Delete a schedule if the user owns it.
 */
exports.deleteSchedule = function(req, res) {
  Promise.all([
    new Schedule({id: req.params.id})
      .fetch({withRelated: ['user', 'courseOfferings', 'extraCurriculars']}),
    req.user.fetch()
  ])
  .spread(function(schedule, user) {
    if (!schedule || schedule.related('user').get('id') !== user.get('id')) {
      throw new Schedule.NotFoundError();
    }

    return schedule.destroy();
  })
  .then(function(schedule) {
    res.send('OK');
  })
  .catch(Schedule.NotFoundError, function() {
    res.status(404).send('Not found.');
  });
};

exports.getTerms = function(req, res) {
  var Terms = Bookshelf.Collection.extend({
    model: Term
  });

  new Terms().fetch()
  .then(function(terms) {
    res.json(terms.toJSON())
  })
  .catch(function() {
    res.status(500).send('Server error.');
  });
}
