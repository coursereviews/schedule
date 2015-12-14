var app = app || {};

$(function() {
  'use strict';

  app.router = new app.AppRouter();
  Backbone.history.start();
});
