// singleCourse.js
// --------
define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

  var singleCourse = Backbone.Model.extend({

    // Model Constructor
    initialize: function() {},

    // Default values for all of the Model attributes
    defaults: {
      title:'',
      code:'',
      professor:'',
      description:'',
      location:'',
      schedule:'',
      requirements:'',
      crn:'',
      href:''
    },

    // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
    validate: function(attrs) {},
  });

  return Model;
});
