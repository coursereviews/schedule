var app = app || {};

(function() {
  'use strict';

  var CourseOfferingListItemView = Backbone.View.extend({
    tagName: 'a',

    className: 'list-group-item',

    template: _.template($('#courseoffering-list-item-template').html()),

    events: {
      'click': 'toggleCourseOffering'
    },

    initialize: function(options) {
      this.props = options.props;

      this.listenTo(app.schedule, 'sync', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.props));
      this.$el.prop('href', window.location.hash);

      this.$el.toggleClass('active', !!app.schedule.get('courseOfferings').get(this.props.id));

      return this;
    },

    toggleCourseOffering: function() {
      if (app.schedule.get('courseOfferings').get(this.props.id)) {
        app.schedule.get('courseOfferings').remove(this.props.id);
        app.schedule.save();
      } else {
        app.schedule.get('courseOfferings').add(this.props);
        app.schedule.save();
      }

      this.render();
    }
  });

  app.CourseOfferingListItemView = CourseOfferingListItemView;
})();
