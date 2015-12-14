'use strict';

const express = require('express');

const controller = require('./catalog.controller');

// const auth = require('../auth');


const router = express.Router();

router.get('/query/course', controller.courseQuery);
router.get('/query/courseoffering', controller.courseOfferingQuery);
router.get('/query/department', controller.departmentQuery);
router.get('/query/meeting', controller.meetingQuery);
router.get('/query/professor', controller.professorQuery);
router.get('/query/requirement', controller.requirementQuery);
router.get('/query/term', controller.termQuery);

module.exports = router;
