var app = app || {};

(function() {
  'use strict';

  var ViewManager = {
    currentView: null,
    showView: function(view) {
      if (this.currentView !== null && this.currentView.cid != view.cid) {
        this.currentView.remove();
      }
      this.currentView = view;
      return $('#main-app').html(this.currentView.render().el);
    }
  };

  app.AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'schedule(/:id)': 'schedule',
      'search': 'search',
    },
    initialize: function() {

    },
    index: function() {
      console.log('index');
    },
    schedule: function(id) {
      app.scheduleId = id;

      ViewManager.showView(new app.ScheduleMainView());
    },
    search: function() {
      ViewManager.showView(new app.SearchView());
    }
  });
})();
