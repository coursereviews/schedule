var app = app || {};

$(function() {
  'use strict';

  app.router = new app.SettingsRouter();
  Backbone.history.start();

  new app.SettingsView();
});
