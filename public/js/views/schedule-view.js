var app = app || {};

(function() {
  'use strict';

  var ScheduleView = Backbone.View.extend({

    template: _.template($('#schedule-template').html()),

    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'change', this.render);

      this.listenTo(app.favorites, 'reset', this.addAllFavorites);

      app.favorites.fetch();
    },

    render: function() {
      this.$el.html(this.template());

      return this;
    },

    addOneFavorite: function(model) {
      var view = new app.CourseListItemView({model: model});
      this.$('.favorites').append(view.render.el());
    },

    addAllFavorites: function() {
      this.$('.favorites').html();
      app.favorites.each(this.addOneFavorite, this);
    }
  });

  app.ScheduleView = ScheduleView;
})();
