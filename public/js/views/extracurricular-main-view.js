var app = app || {};

(function() {
	'use strict';

	app.ExtraCurricularMainView = Backbone.View.extend({

		template: _.template($('#extracurriculars-template').html()),

		initialize: function() {
			this.$extracurricularsList = this.$('.extracurriculars-list');

			this.listenTo(app.extracurriculars, 'reset', this.addAll);

			app.extracurriculars.fetch();
			this.render();
		},
		render: function() {
			var el = this.$el.html(this.template());

			this.$('.time').timepicker({
				showDuration: true,
				timeFormat: 'g:ia',
				step: 5
			});

			this.$('.date').datepicker({
				format: 'm/d/yyyy',
				autoclose: true
			});

			this.$('.days').select2({
				placeholder: 'Select multiple days'
			});

			$('#main-app').append(el);
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
