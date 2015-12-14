var app = app || {};

(function() {
  'use strict';

  var CourseListItemView = Backbone.View.extend({
    tagName: 'a',

    className: 'list-group-item',

    template: _.template($('#course-list-item-template').html()),

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      // toggle the star to the favorited state
      this.$('.glyphicon').toggleClass('glyphicon-star', this.model.get('favorited'));
      this.$('.glyphicon').toggleClass('glyphicon-star-empty', !this.model.get('favorited'));

      return this;
    }
  });

  app.CourseListItemView = CourseListItemView;
})();
