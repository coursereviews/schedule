var app = app || {};

$(function() {
  new app.AppRouter();
  Backbone.history.start();
});
