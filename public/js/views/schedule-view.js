var app = app || {};

(function() {
  'use strict';

  var ScheduleView = Backbone.View.extend({

    events: {

    },

    initialize: function() {
      this.listenTo(app.scheduleCourseOfferings, 'reset', this.addAllCourseOfferings);
    },

    render: function() {
      
    },

    addOneCourseOffering: function() {

    },

    addAllCourseOfferings: function() {

    }
  });

  app.ScheduleView = ScheduleView;
})();
