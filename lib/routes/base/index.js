'use strict';

const express = require('express');

const controller = require('./base.controller');


const router = express.Router();

router.post('/', controller.index);
router.get('/login', controller.getLogin);
router.post('/login', controller.postLogin);
router.get('/login', controller.logout);
router.get('/singup', controller.getSignup);
router.post('/signup', controller.postSignup);

module.exports = router;
