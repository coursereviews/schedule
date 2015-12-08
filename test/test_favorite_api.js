const app = require('../lib/server').app;
const express = require('express');
const favoriteAPI = require('../lib/routes/favorite/favorite.controller');
const User = require('../lib/models/user');
const assert = require('assert');

/*
 NOTE: This test should work with the current Fall 2015 catalog that gets scraped.
 It will not work with other data.
 Additionally, this test code only works if the favorite table is already empty.

*/
/*
request(app)
.post('/api/favorites')
.field('email', 'jabillings@middlebury.edu')
.field('password', 'julian')
.end(function(err, res) {
  if (err) console.log(err);
  console.log(res.cookie);
});
*/

runTests = function(email){
  return new Promise(function(resolve, reject) {
    var user;
    var usr = new User(email).fetch()
    .then(function(usr) {
      user = usr;
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

runTests('jabillings@middlebury.edu')
.then(function(result) {
  if (result === true) {
    console.log("Favorite Tests Passed!");
  } else {
    console.log("Tests Failed");
  }
})
