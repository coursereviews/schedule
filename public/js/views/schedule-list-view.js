var app = app || {};

(function() {
  'use strict';

  var ScheduleListView = Backbone.View.extend({
    template: _.template($('#schedule-list-template').html()),

    initialize: function() {
      this.listenTo(app.schedules, 'reset', this.showSchedulesOrNoneMessage);

      app.schedules.fetch({reset: true});
    },

    render: function() {
      this.$el.html(this.template());

      return this;
    },

    addOneScheduleToList: function(model) {
      var view = new app.ScheduleListItemView({model: model});
      this.$('.schedules-list').append(view.render().el);
    },

    addAllSchedulesToList: function() {
      this.$('.schedules-list').html('');
      app.schedules.each(this.addOneScheduleToList, this);
    },

    showSchedulesOrNoneMessage: function() {
      if (app.schedules.length) {
        this.addAllSchedulesToList();
      } else {
        this.$('.no-schedules-message').removeClass('hidden');
      }
    }
  });

  app.ScheduleListView = ScheduleListView;
})();
