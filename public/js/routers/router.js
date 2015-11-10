// DesktopRouter.js
// ----------------
define(['jquery',
        'underscore',
        'backbone',
        'models/model',
        'views/view',
], function($, _, Backbone, Model, View) {

  var MainRouter = Backbone.Router.extend({
    initialize: function() {
      // Tells Backbone to start watching for hashchange events
      Backbone.history.start();
    },

    // All of your Backbone Routes (add more)
    routes: {
      // When there is no hash on the url, the home method is called
      '': 'index',
      'login': 'login',
      'logout': 'logout',
    },

    index: function() {
      // Instantiates a new view which will render the header text to the page
      new View();
    },
    login: function() {

    },
    logout: function() {

    },

  });

  return MainRouter;
});
