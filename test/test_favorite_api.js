const assert = require('assert');
const http = require('http');
const favoriteAPI = require('../lib/routes/favorite/favorite.controller');

/*
 NOTE: This test should work with the current Fall 2015 catalog that gets scraped.
 It will not work with other data.
 Additionally, this test code only works if the favorite table is already empty.

*/

exports.runTests = function(user){

  favoriteAPI.getAllFavoritesHelper(user)
  .then(function(result) {
    assert.strictEqual(result.models.length, 0, "department_id search not working for courses");
    return favoriteAPI.addFavoriteHelper(user, 1);
  }).then(function() {
    return favoriteAPI.getAllFavoritesHelper(user);
  }).then(function(result) {
    assert.strictEqual(result.models.length, 1, "department_id search not working for courses");
    return favoriteAPI.removeFavoriteHelper(user, 1);
  }).then(function() {
    return favoriteAPI.getAllFavoritesHelper(user);
  }).then(function(result) {
    assert.strictEqual(result.models.length, 0, "department_id search not working for courses");
    return favoriteAPI.removeFavoriteHelper(user, -1);
  }).then(function() {
    return favoriteAPI.getAllFavoritesHelper(user);
  }).then(function(result) {
    assert.strictEqual(result.models.length, 0, "department_id search not working for courses");
    resolve(true);
  });

}
