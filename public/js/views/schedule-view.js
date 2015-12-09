var app = app || {};

(function() {
  'use strict';

  var ScheduleView = Backbone.View.extend({

    template: _.template($('#schedule-template').html()),

    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      console.log(this.model);
      this.$el.html(this.template());
    },
  });

  return app.ScheduleView = ScheduleView;
})();
