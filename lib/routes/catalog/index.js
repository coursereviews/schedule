'use strict';

const express = require('express');

const controller = require('./catalog.controller');

// const auth = require('../auth');


const router = express.Router();

router.get('/', controller.index);
router.get('/level/:level', controller.level);
router.get('/code/:course_code', controller.code);
router.get('/dept/:department', controller.department);
router.get('/href/:href', controller.href);
router.get('/subject/:subject', controller.subject);
router.get('/alternate/:alternate', controller.alternate);
router.get('/type/:type', controller.type);
router.get('/term/:term', controller.term);
router.get('/requirements/:requirement', controller.requirements);
router.get('/instructor/:instructor', controller.instructor);
router.get('/location/:location', controller.location);
router.get('/crn/:crn', controller.crn);
router.get('/query', controller.query);

router.post('/schedule/create', controller.createSchedule);
router.post('/schedule/update/', controller.updateSchedule);
router.post('/schedule/delete', controller.deleteSchedule);

module.exports = router;
