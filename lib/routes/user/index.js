'use strict';

const express = require('express');

const controller = require('./user.controller');

// const auth = require('../auth');


const router = express.Router();

router.get('/', controller.index);
router.delete('/:id', controller.destroy);
router.get('/me', controller.me);
router.put('/:id/password', controller.changePassword);
router.get('/:id', controller.show);
router.post('/', controller.create);

module.exports = router;
