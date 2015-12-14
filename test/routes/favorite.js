'use strict';

/* global describe, it, before */

const Promise = require('bluebird');
const User = require('../../lib/models/user');
const knex = require('knex')(require('../../lib/settings/knexfile'));
const Bookshelf = require('bookshelf')(knex);
const supertest = require('supertest');
var agent, app, superAgent;


var authedAgent;

describe('/api/favorite tests, POST and GET', function() {

  before('clear out current favorites', function(done) {

    var newUsr;

    var usr = new User({email: 'jabillings@middlebury.edu'}).fetch()
    .then(function(user) {
      if (!user){
        newUsr = true;
        return;
      } else {
        newUsr = false;
        return Bookshelf.knex('favorite')
        .delete({where: {schedule_user_id: user.attributes.id}});
      }
    }).then(function() {
      return require('../../lib/server');
    }).then(function(server) {
      // server = requrie('../../lib/server');
      app = server;
      return supertest(app);
    }).then(function(sA) {
      // sA = supertest(app);
      superAgent = sA;
      if (newUsr){
        superAgent
          .post('/signup')
          .send({name: 'julian', email: 'jabillings@middlebury.edu', password: 'julian'})
          .end(done);
      } else {
        done();
      }
    }).catch(function(err) {
      console.log(err);
    });
  });

  /*

  var usr = new User({email: 'jabillings@middlebury.edu'}).fetch()
  .then(function(result) {
    return Bookshelf.knex('favorite')
      .delete({where: {schedule_user_id: result.attributes.id}});
  }).

  */

  describe('/api/favorite:id POST requests', function() {
    before(Promise.coroutine(function*(done) {
      agent = require('../agent');
      authedAgent = yield agent;

    }));

    it('should be able to post a single course', function(done) {

      authedAgent
        .post('/api/favorite/9')
        .expect(200)
        .end(done);
    });

    it('should be able to post a second course', function(done) {

      authedAgent
        .post('/api/favorite/18')
        .expect(200)
        .end(done);
    });

    it('should be able to post a third course', function(done) {

      authedAgent
        .post('/api/favorite/5')
        .expect(200)
        .end(done);
    });

    it('should not post the same course to favorites multiple times', function(done) {

      authedAgent
        .post('/api/favorite/9')
        .expect(500)
        .end(done);
    });

    it('should not be able to post a single course with a negative ID', function(done) {

      authedAgent
        .post('/api/favorite/-1')
        .expect(404)
        .end(done);
    });

    it('should not be able to post a single course with an invalid ID', function(done) {

      authedAgent
        .post('/api/favorite/1000')
        .expect(404)
        .end(done);
    });

  });

  describe('/api/favorite GET requests', function() {

    before(Promise.coroutine(function*(done) {
      authedAgent = yield agent;
    }));

    it('should be able to get all of a user\'s favorite courses', function(done) {

      authedAgent
        .get('/api/favorite')
        .expect(200)
        .expect(function(res) {
          var data = res.body;
          if (data.length !== 3 || data[0].title !== 'Municipal Fictions' ||
            data[1].title !== 'Trade & For. Aid in Latin Amer') {
            throw new Error("Incorrect courses returned");
          }
        })
        .end(done);
    });

  });


  describe('/api/favorite DELETE requests', function() {

    before(Promise.coroutine(function*(done) {
      authedAgent = yield agent;
    }));

    it('should delete a favorite course', function(done) {

      authedAgent
        .del('/api/favorite/5')
        .expect(200)
        .expect(function(res) {
          var data = res.body;
          if (data.length !== 2) {
            throw new Error("Delete failed");
          }
        }).end(done);

    });

    it('should not make a difference if user deletes a course that isn\'t a favorite', function(done) {

      authedAgent
        .del('/api/favorite/5')
        .expect(200)
        .expect(function(res) {
          var data = res.body
          if (data.length !== 2) {
            throw new Error("Delete failed");
          }
        });

        authedAgent
          .del('/api/favorite/7')
          .expect(200)
          .expect(function(res) {
            var data = res.body
            if (data.length !== 2) {
              throw new Error("Delete failed");
            }
          })
          .end(done);

    });

    it('should not be able to delete a course with a negative id', function(done) {

      authedAgent
        .del('/api/favorite/-1')
        .expect(500)
        .end(done);

    });
  });

});
