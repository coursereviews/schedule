'use strict';

/* global describe, it */

const supertest = require('supertest');

const app = require('../../lib/server');
const agent = supertest(app);

describe('POST /signup', function() {

  it('should create new user', function(done) {
    agent
      .post('/signup')
      .send({name: 'julian', email: 'jabillings@middlebury.edu', password: 'julian'})
      .expect(302)
      .expect('Location', '/')
      .end(done);
  });
});

describe('POST /login', function() {

  beforeEach(function() {
    // create fixtures for users, etc
  });

  it('should redirect to /login for failed login', function(done) {
    agent
      .post('/login')
      .send({email: '', password: ''})
      .expect(302)
      .expect('Location', '/login')
      .end(done);
  });

  it('should login correctly', function(done) {
    // going to fail for now - since we have no fixtueres (eg: fake data)
    agent
      .post('/login')
      .send({email: 'jabillings@middlebury.edu', password: 'julian'})
      .expect(302)
      .expect('Location', '/')
      .end(done);
  });
});
