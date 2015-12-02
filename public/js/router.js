var app = app || {};

(function() {
  'use strict';

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'schedule(/:id)': 'schedule',
      'search': 'search',
      'extracurriculars': 'extracurriculars'
    },

    index: function() {
      console.log('index');
    },

    schedule: function(id) {
      new app.views.ScheduleView();
    },

    search: function() {

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

  app.router.AppRouter = new AppRouter();
})();
