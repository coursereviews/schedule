'use strict';

const express = require('express');
const CAS = require('cas-authentication');

const router = express.Router();

const cas = new CAS({
  cas_url: 'https://login.middlebury.edu/cas/login',
  service_url: 'localhost:8000/',
  cas_version: '2.0',
  renew: false,
  is_dev_mode: true,
  dev_mode_user: '',
  session_name: 'cas_user',
  session_info: 'cas_userinfo',
  destroy_session: false,
});

router.get('/login', cas.bounce, function(req, res) {
  res.redirect(302, '/');
});

router.get('/logout', cas.logout, function(req, res) {
  res.redirect('/login');
});

module.exports = router;
