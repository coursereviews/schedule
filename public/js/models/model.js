// Model.js
// --------
define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

  var Model = Backbone.Model.extend({

    // Model Constructor
    initialize: function() {},

    // Default values for all of the Model attributes
    defaults: {},

    // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
    validate: function(attrs) {},
  });

  return Model;
});
