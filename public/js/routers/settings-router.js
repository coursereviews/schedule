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

      var $el = $('#navbar-settings');
      if ($el.hasClass('active') === false) {
        $('#navbar li.active').removeClass('active');
      }
      $el.addClass('active');

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
