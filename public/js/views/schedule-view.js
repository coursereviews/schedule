var app = app || {};

(function() {
  'use strict';

  var ScheduleView = Backbone.View.extend({

    template: _.template($('#schedule-template').html()),

    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'change', this.render);

      this.listenTo(app.favorites, 'reset', this.addAllFavorites);
      this.listenTo(app.schedule, 'reset', this.addSchedule);

      app.favorites.fetch({reset: true});
      app.schedule.fetch({reset: true});
    },

    render: function() {
      this.$el.html(this.template());

      var scheduleHeight = 30 * 18;
      this.$('.schedule .panel-body').css('height', scheduleHeight);

      return this;
    },

    addSchedule: function(model) {
      var view = new app.ScheduleCourseView({model: model});
      this.$('.schedule').append(view.render().el);
    },

    addOneFavorite: function(model) {
      var view = new app.CourseListItemView({model: model});
      this.$('.favorites').append(view.render().el);
    },

    addAllFavorites: function() {
      this.$('.favorites').html();
      app.favorites.each(this.addOneFavorite, this);
    }
  });

  app.ScheduleView = ScheduleView;
})();
