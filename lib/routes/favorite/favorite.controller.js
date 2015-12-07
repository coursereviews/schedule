'use strict';

const Course = require('../../models/course.js');

// function gets all favorites of the current user
exports.getAllFavorites = function(req, res) {

  getAllFavoritesHelper(req.user)
  .then(function(result) {
    if (result === false){
      res.status(500).send('Server Error.');
    } else {
      res.send(result.toJSON());
    }
  });

}

// function that does the non-HTTP work of getAllFavorites
// useful for testing
function getAllFavoritesHelper(user){
  return new Promise(function(resolve, reject) {
    user.fetch({withRelated: ['favorites']})
    .then(function(userData) {
      resolve(userData.related('favorites'));
    }).catch(function(err) {
      console.log(err);
      resolve(false);
    });
  });
}


// function adds a favorite to the current user's favorites list
exports.addFavorite = function(req, res) {

  addFavoriteHelper(req.user, req.params.id)
  .then(function(result) {
    if (result === false){
       res.status(500).send('Server Error.');
    } else {
      res.send(result);
    }
  });

}

// function that does the non-HTTP work of addFavorite
// useful for testing
function addFavoriteHelper(user, id) {
  return new Promise(function(resolve, reject) {
    var userRef;
    user.fetch({withRelated: ['favorites']})
    .then(function(user) {
      userRef = user;
      var course = new Course({id: id});
      return course.fetch();
    }).then(function(course) {
      return userRef.related('favorites').attach(course.get('id'));
    }).then(function(collection) {
      resolve(JSON.stringify(collection.models));
    }).catch(function(err) {
      console.log(err);
      resolve(false);
    });
  });
}


// function removes a favorite from the current user's favorites list
exports.removeFavorite = function(req, res) {

  removeFavoriteHelper(req.user, req.params.id)
  .then(function(result) {
    if (result === false){
       res.status(500).send('Server Error.');
    } else {
      res.send(result);
    }
  });

}

// function that does the non-HTTP work of removeFavorite
// useful for testing
function removeFavoriteHelper(user, id) {
  return new Promise(function(resolve, reject) {
    var userRef;
    user.fetch({withRelated: ['favorites']})
    .then(function(user) {
      userRef = user;
      var course = new Course({id: id});
      return course.fetch();
    }).then(function(course) {
      return userRef.related('favorites').detach(course.get('id'));
    }).then(function(collection) {
      resolve(JSON.stringify(collection.models));
    }).catch(function(err) {
      console.log(err);
      resolve(false);
    });
  });
}
