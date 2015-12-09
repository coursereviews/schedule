'use strict';

const express = require('express');
const passport = require('passport');

const auth = require('../../settings/passport');
const controller = require('./base.controller');


const router = express.Router();

router.get('/', auth.requireAuth, controller.index);
router.get('/login', controller.getLogin);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));
router.get('/logout', auth.requireAuth, controller.logout);
router.get('/signup', controller.getSignup);
router.post('/signup', controller.postSignup);

router.get('/search', controller.getSearch);
router.get('/settings', controller.settings);

module.exports = router;
