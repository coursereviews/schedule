'use strict';

/* global describe, it, before */

var Promise = require('bluebird');

var agent = require('../agent');


var authedAgent;

describe('/api/catalog', function() {

  before(Promise.coroutine(function*(done) {
    authedAgent = yield agent;
  }));

  it('GET / ', function(done) {
    authedAgent
      .get('/api/catalog/query/')
      .expect(200)
      .end(function(err, res) {
        // console.log(res.body);
        done();
      });
  });

  it('GET / ', function(done) {
    authedAgent
      .get('/api/catalog/')
      .expect(200)
      .end(function(err, res) {
        // console.log(res.body);
        done();
      });
  });

});
