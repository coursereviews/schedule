'use strict';

const express = require('express');

const controller = require('./account.controller');
const auth = require('../../settings/passport');


const router = express.Router();

router.post('/', auth.isAuthenticated, controller.index);

module.exports = router;
