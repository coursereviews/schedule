'use strict';

var supertest = require('supertest');
var Promise = require('bluebird');

var app = require('../lib/server');
var agent = supertest.agent(app);


// should be replaced
var fixtureAccount = {
  'email': 'jabillings@middlebury.edu',
  'password': 'julian'
};

module.exports = new Promise(function(resolve, reject) {
  agent
    .post('/login')
    .send(fixtureAccount)
    .end(function(err, res) {
      if (err) {
        reject();
      }
      agent.saveCookies(res);
      resolve(agent);
    });
});
