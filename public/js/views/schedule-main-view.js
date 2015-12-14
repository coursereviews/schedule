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

      this.$('favorites')
        .css('height', $(window).height() - 101 - 50)
        .css('overflow-y', 'scroll');

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
    },

    remove: function() {
      this.scheduleView.remove();
      Backbone.View.prototype.remove.call(this);
    }
  });

  app.ScheduleMainView = ScheduleMainView;
})();
