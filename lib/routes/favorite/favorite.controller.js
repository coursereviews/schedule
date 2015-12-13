'use strict';


const Course = require('../../models/course.js');
const User = require('../../models/user.js');

// function gets all favorites of the current user
exports.getAllFavorites = function(req, res) {

  getAllFavoritesHelper(req.user)
  .then(function(result) {
    res.json(result);
  }).catch(User.NotFoundError, function(err) {
    res.status(404).send('Not found.');
  }).catch(function(err) {
    res.status(500).send('Server Error.');
  });

};

// function that does the non-HTTP work of getAllFavorites
// useful for testing
var getAllFavoritesHelper = function(user) {
  return new Promise(function(resolve, reject) {
    user.fetch({where: {email: user.get('email')}, withRelated: ['favorites']})
    .then(function(userData) {
      if (!userData) {
        throw User.NotFoundError;
      } else {
        resolve(userData.related('favorites'));
      }
    }).catch(function(err) {
      console.log(err);
      reject(err);
    });
  });
};


// function adds a favorite to the current user's favorites list
exports.addFavorite = function(req, res) {

  addFavoriteHelper(req.user, req.params.id)
  .then(function(result) {
    res.json(result);
  }).catch(User.NotFoundError, function() {
    res.status(404).send('Not found.');
  }).catch(function(err) {
    res.status(500).send('Server Error.');
  });

};

// function that does the non-HTTP work of addFavorite
// useful for testing
var addFavoriteHelper = function(user, id) {
  return new Promise(function(resolve, reject) {
    var userRef;
    user.fetch({withRelated: ['favorites']})
    .then(function(user) {
      if (!user) {
        throw new User.NotFoundError();
      }
      userRef = user;
      var course = new Course({id: id});
      return course.fetch();
    }).then(function(course) {
      if (!course) {
        throw new Course.NotFoundError();
      }
      return userRef.related('favorites').attach(course.get('id'));
    }).then(function(collection) {
      resolve(JSON.stringify(collection.models));
    }).catch(function(err) {
      console.log(err);
      reject(err);
    });
  });
};


// function removes a favorite from the current user's favorites list
exports.removeFavorite = function(req, res) {

  removeFavoriteHelper(req.user, req.params.id)
  .then(function(result) {
    res.json(result);
  }).catch(User.NotFoundError, function() {
    res.status(404).send('Not found.');
  }).catch(function(err) {
    res.status(500).send('Server Error.');
  });

};

// function that does the non-HTTP work of removeFavorite
// useful for testing
var removeFavoriteHelper = function(user, id) {
  return new Promise(function(resolve, reject) {
    var userRef;
    user.fetch({withRelated: ['favorites']})
    .then(function(user) {
      if (!user) {
        throw new User.NotFoundError();
      }
      userRef = user;
      var course = new Course({id: id});
      return course.fetch();
    }).then(function(course) {
      if (!course) {
        throw new Course.NotFoundError();
      }
      return userRef.related('favorites').detach(course.get('id'));
    }).then(function(collection) {
      resolve(JSON.stringify(collection.models));
    }).catch(function(err) {
      console.log(err);
      reject(err);
    });
  });
};

exports.getAllFavoritesHelper = getAllFavoritesHelper;
exports.removeFavoriteHelper = removeFavoriteHelper;
exports.addFavoriteHelper = addFavoriteHelper;

