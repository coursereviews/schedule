'use strict';

const Course = require('../../models/course.js');

// function gets all favorites of the current user
exports.getAllFavorites = function(req, res) {

  var user = req.user.fetch({withRelated: ['favorites']})
  .then(function(user) {
    res.send(user.related('favorites').toJSON());
  });

}


// function adds a favorite to the current user's favorites list
exports.addFavorite = function(req, res) {
  var id = req.params.id;
  console.log(id);
  var user = req.user.fetch({withRelated: ['favorites']})
  .then(function(user) {
    console.log(user);
    var course = new Course({id: id});
    course.fetch()
    .then(function(course) {
      console.log(course);
      user.related('favorites').add(course);
      res.send(user.related('favorites').toJSON());
    });

  });

}


// function removes a favorite from the current user's favorites list
exports.removeFavorite = function(req, res) {


}
