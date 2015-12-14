'use strict';

const express = require('express');

const controller = require('./schedule.controller');

// const auth = require('../auth');


const router = express.Router();

router.get('/terms', controller.getTerms);

router.get('/', controller.getAllSchedules);
router.post('/', controller.createSchedule);
router.get('/:id', controller.getSchedule);
router.patch('/:id', controller.updateSchedule);
router.delete('/:id', controller.deleteSchedule);

module.exports = router;
