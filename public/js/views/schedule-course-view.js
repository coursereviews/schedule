var app = app || {};

(function() {
  'use strict';

  var ScheduleCourseView = Backbone.View.extend({
    tagName: 'div',

    className: 'schedule-course',

    template: _.template($('#schedule-course-item-template').html()),

    initialize: function() {
      
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  app.ScheduleCourseView = ScheduleCourseView;
})();
