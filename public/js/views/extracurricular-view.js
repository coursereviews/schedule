var app = app || {};

(function() {
  'use strict';

  app.ExtraCurricularView = Backbone.View.extend({
    tagName: 'li',

    className: 'extracurricular-list-item list-group-item',

    template: _.template($('#extracurricular-list-item-template').html()),

    events: {
      'click .extracurricular-delete': 'removeExtracurricular'
    },

    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      return this;
    },

    removeExtracurricular: function() {
      this.model.destroy();
    }
  });

})();
