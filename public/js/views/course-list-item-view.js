var app = app || {};

(function() {
  'use strict';

  var CourseListItemView = Backbone.View.extend({
    tagName: 'a',

    className: 'list-group-item',

    template: _.template($('#course-list-item-template')),

    initialize: function() {

    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    }
  });

  app.CourseListItemView = CourseListItemView;
})();
