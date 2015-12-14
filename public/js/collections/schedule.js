var app = app || {};

(function() {
  'use strict';

  var ScheduleCollection = Backbone.Collection.extend({
    model: app.FavoriteModel,
    url: '/api/schedule/'
  });

  app.ScheduleCollection = new ScheduleCollection();
})();

