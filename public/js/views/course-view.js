var app = app || {};

(function() {
  'use strict';

  app.CourseView = Backbone.View.extend({
    tagName: 'div',

    className: 'col-md-12',

    template: _.template($('#course-item-template').html()),

    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

  });

})();
