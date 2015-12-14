/* global -Promise */

'use strict';

const Promise = require('bluebird');
const Course = require('../../models/course.js');
const User = require('../../models/user.js');

// function gets all favorites of the current user
exports.getAllFavorites = function(req, res) {

  getAllFavoritesHelper(req.user)
  .then(function(result) {
    res.json(result);
  }).catch(User.NotFoundError, function(err) {
    res.status(404).send('Not found.');
  }).catch(function() {
    res.status(500).send('Server error.');
  });

};

// function that does the non-HTTP work of getAllFavorites
// useful for testing
var getAllFavoritesHelper = function(user) {
  return user.fetch({withRelated: ['favorites']})
  .then(function(userData) {
    if (!userData) {
      throw new User.NotFoundError();
    }

    return Promise.map(userData.related('favorites').models, function(model) {
      return model.serializeWithFavorited({user: userData, omitPivot: true});
    });
  });
};


/* POST /api/favorites/:id
 * Where :id is the id of the course to favorite.
 */
exports.addFavorite = function(req, res) {
  addFavoriteHelper(req.user, req.params.id)
  .then(function(result) {
    res.json(result);
  })
  .catch(User.NotFoundError, function() {
    res.status(404).send('User not found.');
  })
  .catch(Course.NotFoundError, function() {
    res.status(404).send('Course not found.');
  })
  .catch(function(err) {
    res.status(500).send('Server Error.');
  });
};

// function that does the non-HTTP work of addFavorite
// useful for testing
var addFavoriteHelper = function(user, id) {
  return Promise.join(
    user.fetch({withRelated: ['favorites'], required: true}),
    new Course({id: id}).fetch(),
  function(user, course) {
    if (!course) {
      throw new Course.NotFoundError();
    }

    if (!user) {
      throw new User.NotFoundError();
    }

    return user.related('favorites').attach(course);
  })
  .then(function(favorites) {
    return Promise.map(favorites.models, function(model) {
      return model.serializeWithFavorited({user: user, omitPivot: true});
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
      resolve(collection.models);
    }).catch(function(err) {
      console.log(err);
      reject(err);
    });
  });
};
