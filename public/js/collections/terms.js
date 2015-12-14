var app = app || {};

(function() {
  'use strict';

  var Terms = Backbone.Collection.extend({
    url: '/api/schedule/terms',

    model: app.TermModel
  });

  app.terms = new Terms();
})();
