var app = app || {};

(function() {
	'use strict';

	app.ExtraCurricularMainView = Backbone.View.extend({

		template: _.template($('#extracurriculars-template').html()),

		events: {
			'click .create-extracurricular': 'createExtracurriclar'
		},

		initialize: function() {
			this.listenTo(app.extracurriculars, 'reset', this.addAll);
			this.listenTo(app.extracurriculars, 'add', this.addOne);

			_.bindAll(this, 'renderSelect2');

			app.extracurriculars.fetch({reset: true});
		},
		render: function() {
			this.$el.html(this.template());

			this.$('input.time').timepicker({
				showDuration: true,
				timeFormat: 'g:ia',
				step: 5
			});

			this.$('input.date').datepicker({
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

			this.$('.extracurriculars-list').append(view.render().el);
		},
		addAll: function() {
			this.$('.extracurriculars-list').html('');
			app.extracurriculars.each(this.addOne, this);
		},
		getInputs: function() {
			return {
				name: this.$('input.name'),
				start_time: this.$('input.start.time'),
				start_date: this.$('input.start.date'),
				end_time: this.$('input.end.time'),
				end_date: this.$('input.end.date'),
				days: this.$('select.days')
			};
		},
		clearAttributeFields: function() {
			_.values(this.getInputs()).forEach(function(input) {
				input.hasClass('days') ? input.select2('val', '') : input.val('');
			});
		},
		createExtracurriclar: function() {
			var newAttributes = this.getInputs();

			_.keys(newAttributes).map(function(key) {
				var input = newAttributes[key];

				if (input.hasClass('days')) {
					newAttributes[key] = input.val() ? input.val().join(',') : '';
				} else {
					newAttributes[key] = input.val();
				}
			});

			app.extracurriculars.create(newAttributes);
			this.clearAttributeFields();
		},

	});
})();
