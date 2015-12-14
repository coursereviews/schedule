var app = app || {};

(function() {
  'use strict';

  var ScheduleView = Backbone.View.extend({

    initialize: function() {
      this.render();
      console.log(app.ScheduleCollection);
    },

    render: function() {
      this.$el.html($("#schedule-template").html());
      return this;
    },
  });

  return app.ScheduleView = ScheduleView;
})();

