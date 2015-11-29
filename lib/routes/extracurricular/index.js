'use strict';

const express = require('express');

const controller = require('./extracurricular.controller');

const router = express.Router();

router.get('/', controller.getAllExtraCurriculars);
router.get('/:id', controller.getExtraCurricular);
router.post('/', controller.createExtraCurricular);
router.patch('/:id', controller.updateExtraCurricular);
router.delete('/:id', controller.deleteExtraCurricular);

module.exports = router;
