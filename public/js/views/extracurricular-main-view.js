var schedule = schedule || {};

(function() {
	'use strict';

	schedule.ExtraCurricularMainView = Backbone.View.extend({
		initialize: function() {

			this.listenTo(schedule.extracurriculars, 'reset', this.render);
		},
		render: function() {

		},
		addOne: function() {
			
		},
		addAll: function() {

		}
	});
})();
