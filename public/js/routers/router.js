var schedule = schedule || {};

(function() {
  'use strict';

  var ScheduleRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'schedule(/:id)': 'schedule',
      'search': 'search',
      'extracurriculars': 'extracurriculars'
    },

    index: function() {

    },

    schedule: function() {

    },

    search: function() {

    },

    extracurriculars: function() {
      if (schedule.view instanceof schedule.ExtraCurricularMainView) {
        schedule.extracurriculars.fetch();
      } else if (app.view) {
        app.view.remove();
        app.view = new ExtraCurricularMainView();
      } else {
        app.view = new ExtraCurricularMainView();
      }
    }
  });
})();
