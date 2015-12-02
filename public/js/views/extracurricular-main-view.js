var app = app || {};

(function() {
	'use strict';

	app.ExtraCurricularMainView = Backbone.View.extend({

		template: _.template($('#extracurriculars-main-template').html()),

		initialize: function() {
			this.$extracurricularsList = this.$('.extracurriculars-list');

			this.listenTo(app.extracurriculars, 'reset', this.addAll);

			app.extracurriculars.fetch();
			this.render();
		},
		render: function() {
			$('main').append(this.template());
		},
		addOne: function(extracurricular) {
			var view = new app.ExtraCurricularView({model: extracurricular});
			this.$extracurricularsList.append(view.render().el);
		},
		addAll: function() {
			this.$extracurricularsList.html('');
			app.extracurriculars.each(this.addOne, this);
		}
	});
})();
