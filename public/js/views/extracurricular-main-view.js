var app = app || {};

(function() {
  'use strict';

  app.views.ExtraCurricularMainView = Backbone.View.extend({
    initialize: function() {
			this.listenTo(schedule.extracurriculars, 'reset', this.addAll);
		},
		render: function() {

		},
		addOne: function() {

		},
		addAll: function() {

			schedule.extracurriculars.each(this.addOne, this);
		}
	});
})();
