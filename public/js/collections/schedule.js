var app = app || {};

(function() {
  'use strict';

  var ScheduleCollection = Backbone.Collection.extend({
    url: '/api/schedule',
    
    model: app.ScheduleModel
  });

  app.ScheduleCollection = new ScheduleCollection();
})();
