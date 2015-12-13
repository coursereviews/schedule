var app = app || {};

(function() {
  'use strict';

  var ScheduleMainView = Backbone.View.extend({

    template: _.template($('#schedule-main-template').html()),

    initialize: function() {
      if (app.scheduleId) {
        this.scheduleView = new app.ScheduleView();
      } else {
        this.scheduleView = new app.ScheduleListView();
      }

      this.listenTo(app.favorites, 'reset', this.addAllFavorites);

      app.favorites.fetch({reset: true});
    },

    render: function() {
      this.$el.html(this.template());
      this.$('.schedule-container').append(this.scheduleView.render().el);

      return this;
    },

    addOneFavorite: function(model) {
      var view = new app.CourseListItemView({model: model});
      this.$('.favorites').append(view.render().el);
    },

    addAllFavorites: function() {
      this.$('.favorites').html('');
      app.favorites.each(this.addOneFavorite, this);
    }
  });

  app.ScheduleMainView = ScheduleMainView;
})();
