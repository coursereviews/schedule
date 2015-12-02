var schedule = schedule || {};

(function() {
  'use strict';

  schedule.ExtraCurricularView = Backbone.View.extend({
    template: $('#extracurricular-template').html(),

    initialize: function() {
      this.listenTo(this.model, 'change', 'render');
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      return this;
    }
  });

})();
