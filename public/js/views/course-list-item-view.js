var app = app || {};

(function() {
  'use strict';

  var CourseListItemView = Backbone.View.extend({
    className: 'list-group',

    template: _.template($('#course-list-item-template').html()),

    initialize: function() {
      this.listenTo(app.schedule, 'change', this.renderOnChangedTerm);
    },

    renderOnChangedTerm: function() {
      if (_.has(app.schedule.changedAttributes(), 'term_id')) {
        return this.render();
      }
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      if (app.schedule) {
        this.model.get('courseOfferings').filter(function(co) {
          co.term = app.TermModel.prototype.parse(co.term);
          return co.term_id === app.schedule.get('term_id');
        }).forEach(this.addCourseOffering, this);
      }

      // toggle the star to the favorited state
      this.$('.glyphicon').toggleClass('glyphicon-star', this.model.get('favorited'));
      this.$('.glyphicon').toggleClass('glyphicon-star-empty', !this.model.get('favorited'));

      return this;
    },

    addCourseOffering: function(courseOffering) {
      var view = new app.CourseOfferingListItemView({props: courseOffering});
      this.$el.append(view.render().el);
    }
  });

  app.CourseListItemView = CourseListItemView;
})();
