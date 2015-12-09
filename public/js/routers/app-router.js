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
      console.log(view.render());
      return $('#main-app').html(this.currentView);
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
      var schedule = app.ScheduleCollection.fetch();
      ViewManager.showView(new app.ScheduleView({model: schedule}));
    },
    search: function() {
      ViewManager.showView(new app.SearchView());
    }
  });
})();
