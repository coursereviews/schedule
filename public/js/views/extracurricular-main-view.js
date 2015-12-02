var schedule = schedule || {};

(function() {
	'use strict';

	schedule.ExtraCurricularMainView = Backbone.View.extend({
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
