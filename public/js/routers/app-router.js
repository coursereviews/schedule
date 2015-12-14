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

      var route = Backbone.history.fragment.split('/')[0];

      var $el = $('#navbar-' + route);
      if ($el.hasClass('active') === false) {
        $('#navbar li.active').removeClass('active');
        $el.addClass('active');
      }

      return $('#main-app').html(this.currentView.render().el);
    }
  };

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'schedule(/:id)': 'schedule',
      'search': 'search',
    },

    index: function() {
      this.navigate('search', {trigger: true, replace: true});
    },

    schedule: function(id) {
      app.scheduleId = id;
      ViewManager.showView(new app.ScheduleMainView());
    },

    search: function() {
      ViewManager.showView(new app.SearchView());
    }
  });

  app.AppRouter = AppRouter;
})();
