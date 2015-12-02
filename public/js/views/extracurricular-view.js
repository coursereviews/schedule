var app = app || {};

(function() {
  'use strict';

  app.ExtraCurricularView = Backbone.View.extend({
    template: _.template($('#extracurricular-template').html()),

    initialize: function() {
      this.listenTo(this.model, 'change', 'render');
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      return this;
    }
  });

})();
