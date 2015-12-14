var app = app || {};

(function() {
  'use strict';

  var ScheduleCourseItemView = Backbone.View.extend({
    tagName: 'div',

    className: 'course-item',

    template: _.template($('#schedule-course-item-template').html()),

    render: function() {
      this.$el.html(this.template(this.model));

      return this;
    },
  });

  app.ScheduleCourseItemView = ScheduleCourseItemView;
})();
