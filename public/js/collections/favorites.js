var app = app || {};

(function() {
  'use strict';

  var FavoritesCollection = Backbone.Collection.extend({
    model: app.CourseModel,

    url: '/api/favorite'
  });

  app.favorites = new FavoritesCollection();
})();
