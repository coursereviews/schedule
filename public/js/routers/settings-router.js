var app = app || {};

(function() {
  'use strict';

  app.SettingsRouter = Backbone.Router.extend({
    routes: {
      '': 'extracurriculars',
      'extracurriculars': 'extracurriculars'
    },

    extracurriculars: function() {
      app.route = 'extracurriculars';

      if (app.view instanceof app.ExtraCurricularMainView) {
        app.extracurriculars.fetch();
      } else if (app.view) {
        app.view.remove();
        app.view = new app.ExtraCurricularMainView();
      } else {
        app.view = new app.ExtraCurricularMainView();
      }
    }
  });

})();
