// View.js
// -------
define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');

  var View = Backbone.View.extend({
    el: '.example',
    initialize: function() {
      this.render();
    },

    events: {},

    render: function() {
      this.template = _.template('template', {});
      this.$el.html(this.template);

      // Maintains chainability
      return this;
    },
  });

  return View;
});
