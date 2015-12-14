var app = app || {};

(function() {
  'use strict';

  var SettingsView = Backbone.View.extend({
    el: '#settings',

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$('a[href="#' + app.route + '"]').addClass('active');
      this.$('#main-app').append(app.view.render().el);

      return this;
    }
  });

  app.SettingsView = SettingsView;
})();
