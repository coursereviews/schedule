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
      'extracurriculars': 'extracurriculars',
      'courses': 'courses'
    },
    initialize: function() {

    },
    index: function() {
      console.log('index');
    },
    schedule: function(id) {
      console.log('schedule');
      var schedule = app.ScheduleCollection;
      ViewManager.showView(new app.ScheduleView({model: schedule}));
    },
    search: function() {
      console.log('search');
      ViewManager.showView(new app.SearchView());
    },
    courses: function() {
      console.log('search');
      ViewManager.showView(new app.SearchView());
    },
    extracurriculars: function() {
      if (app.views instanceof app.views.ExtraCurricularMainView) {
        app.collections.extracurriculars.fetch();
      } else if (app.view) {
        app.view.remove();
        app.view = new ExtraCurricularMainView();
      } else {
        app.view = new ExtraCurricularMainView();
      }
    }
  });
})();
