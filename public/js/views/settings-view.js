var app = app || {};

(function() {
  'use strict';

  app.SettingsView = Backbone.View.extend({
    el: '#settings',

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$('a[href="#' + app.route + '"]').addClass('active');
    }
  });
})();
