var app = app || {};

(function() {
	'use strict';

	app.ExtraCurricularMainView = Backbone.View.extend({

		template: _.template($('#extracurriculars-template').html()),

		events: {
			'click .create-extracurricular': 'createExtracurriclar'
		},

		initialize: function() {
			this.$extracurricularsList = this.$('.extracurriculars-list');

			this.listenTo(app.extracurriculars, 'reset', this.addAll);

			_.bindAll(this, 'renderSelect2');

			app.extracurriculars.fetch();
		},
		render: function() {
			this.$el.html(this.template());

			this.$('.time').timepicker({
				showDuration: true,
				timeFormat: 'g:ia',
				step: 5
			});

			this.$('.date').datepicker({
				format: 'm/d/yyyy',
				autoclose: true
			});

			// Hide the Select 2 days of the week field initially to avoid
			// flash of unstyled content
			this.$('.days').addClass('hidden');

			// Rendering the Select 2 before it's in the DOM won't display
			// the placeholder
			_.defer(this.renderSelect2);

			return this;
		},
		renderSelect2: function() {
			this.$('.days').select2({
				placeholder: 'Select multiple days'
			})
			.removeClass('hidden');
		},
		addOne: function(extracurricular) {
			var view = new app.ExtraCurricularView({model: extracurricular});
			this.$extracurricularsList.append(view.render().el);
		},
		addAll: function() {
			this.$extracurricularsList.html('');
			app.extracurriculars.each(this.addOne, this);
		},
		createExtracurriclar: function() {
			console.log()
		}
	});
})();
