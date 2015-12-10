'use strict';

const app = require('../lib/server').app;
const express = require('express');
const favoriteAPI = require('../lib/routes/favorite/favorite.controller');
const User = require('../lib/models/user');
const assert = require('assert');
// const request = require('supertest');
const mocha = require('mocha');

/*
 NOTE: This test should work with the current Fall 2015 catalog that gets scraped.
 It will not work with other data.
 Additionally, this test code only works if the favorite table is already empty.

*/


var runFavoriteTests = function(email){
  return new Promise(function(resolve, reject) {
    var user;
    var usr = new User({email: email}).fetch()
    .then(function(usr) {
      user = usr;
      //console.log(user);
      return favoriteAPI.getAllFavoritesHelper(user);
    }).then(function(result) {
      assert.strictEqual(result.models.length, 0, "empty favorites DB not returning 0 results");
      return favoriteAPI.addFavoriteHelper(user, 1);
    }).then(function() {
      return favoriteAPI.getAllFavoritesHelper(user);
    }).then(function(result) {
      assert.strictEqual(result.models.length, 1, "adding course doesn't work");
      return favoriteAPI.removeFavoriteHelper(user, 1);
    }).then(function() {
      return favoriteAPI.getAllFavoritesHelper(user);
    }).then(function(result) {
      assert.strictEqual(result.models.length, 0, "removing course doesn't work");
      resolve(true);
    }).catch(function(err) {
      console.log(err);
      reject(Error(err));
    });
  });

}



runFavoriteTests('jabillings@middlebury.edu')
.then(function(result) {
  console.log("Favorite Tests Passed!");
}).catch(function(err) {
  console.log("Tests Failed");
});

//console.log(Object.keys(request(app)));
/*
var usr = agent.agent();

usr.post('http://localhost:8000/login')
.send({email: 'jabillings@middlebury.edu', password: 'julian'})
.end(function(err, res) {
  //console.log(res);
  //console.log(res);
});

usr.get('http://localhost:8000/api/catalog/query/courseoffering?crn=91423')
.end(function(err, res) {
  console.log(res.body);
});*/

/*
  var agent = request.agent(app);
  agent
  .get('/login', function(req, res) {
    console.log(res.status);
    res.on('data', function(data){
      console.log('here');
    })
    res.cookie('cookie', 'hey');
    res.send();
  });

  agent
  .post('/login')
  .field('email', 'jabillings@middlebury.edu')
  .field('password', 'julian')
  .end(function (err, res) {
    console.log(res.status);
    console.log(res.headers['set-cookie']);
  });
*/
