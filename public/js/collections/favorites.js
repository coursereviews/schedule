var app = app || {};

(function() {
  'use strict';

  var FavoritesCollection = Backbone.Collection.extend({
    model: app.CourseModel,

    url: '/api/favorite',

    initialize: function() {
      this.on('sync', this.setFavoriteAttribute);
    },

    setFavoriteAttribute: function(models) {
      models.each(function(model) {
        model.set('favorited', true);
      });
    }
  });

  app.favorites = new FavoritesCollection();
})();
