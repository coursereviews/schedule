'use strict';

/* global describe, it, before */

const Promise = require('bluebird');
const load = require('../load_data');
const supertest = require('supertest');
const app = require('../../lib/server');
const superAgent = supertest(app);
var agent = require('../agent');


var authedAgent;


describe('/api/favorite:id POST requests', function() {

  before(Promise.coroutine(function*(done) {
    authedAgent = yield agent;
  }));

  it('should be able to post a single course', function(done) {

    authedAgent
      .post('/api/favorites/9')
      .expect(200)
      .expect(function(res) {
        var data = JSON.parse(res.body);

        if (data[0]['9'].add !== true) {
          throw new Error("Incorrect number of courses returned");
        }
      })
      .end(done);
  });

  it('should not be able to post a single course with a negative ID', function(done) {

    authedAgent
      .post('/api/favorites/-1')
      .expect(500)
      .end(done);
  });

  it('should not be able to post a single course with an invalid ID', function(done) {

    authedAgent
      .post('/api/favorites/1000')
      .expect(500)
      .end(done);
  });

});
