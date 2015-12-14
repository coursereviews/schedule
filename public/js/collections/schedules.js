var app = app || {};

(function() {
  'use strict';

  var ScheduleCollection = Backbone.Collection.extend({
    model: app.ScheduleModel,

    url: '/api/schedule'
  });

  app.schedules = new ScheduleCollection();
})();
