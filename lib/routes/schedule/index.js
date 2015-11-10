'use strict';

const express = require('express');

const controller = require('./schedule.controller');

// const auth = require('../auth');


const router = express.Router();

router.get('/', controller.getAllSchedules);
router.get('/:id', controller.getSchedule);
router.post('/:id', controller.createSchedule);
router.patch('/:id', controller.updateSchedule);
router.patch('/:id', controller.deleteSchedule);

module.exports = router;
