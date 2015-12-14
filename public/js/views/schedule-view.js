var app = app || {};

(function() {
  'use strict';

  var ScheduleView = Backbone.View.extend({

    template: _.template($('#schedule-template').html()),

    termTemplate: _.template('<option value="<%- id %>"><%- season %> <%- year %></option>'),

    events: {
      'focus .schedule-name': 'focusName',
      'blur .schedule-name': 'blurName',
      'keydown .schedule-name': 'typeName',
      'change select.schedule-term': 'changeTerm'
    },

    namePlaceholder: 'Click to name your schedule',

    initialize: function() {
      // Create a new model to represent the schedule.
      // If an id is specified, we'll try to get the model from the server.
      if (app.scheduleId === 'new') {
        this.model = app.schedule = new app.ScheduleModel();
      } else {
        this.model = app.schedule = new app.ScheduleModel({id: app.scheduleId});
      }

      // Bind to the error event before requesting the schedule.
      // So we can handle a 404 nicely.
      this.listenTo(this.model, 'error', this.handleScheduleNotFound);

      this.listenTo(app.terms, 'reset', this.renderTerms);

      this.listenTo(this.model.get('courseOfferings'), 'add', this.addOneCourseOffering);

      _.bindAll(this, 'autosizeInput', 'renderSelect2', 'changeTerm');

      if (!this.model.isNew()) {
        // If we're not creating a new schedule, fetch it.
        this.model.fetch({success: function() {
          this.renderSchedule();
          this.renderTerms();
          this.addAllCourseOfferings();
        }.bind(this)}, {parse: true});
      } else {
        // Nothing to fetch so we can render the schedule now.
        this.renderSchedule();
        this.renderTerms();
      }

      app.terms.fetch({reset: true, parse: true});
    },

    render: function() {
      // Essentially a no-op since ScheduleMainView will render ScheduleView
      // before the schedule has been fetched. We might want to render a not
      // found message instead of the schedule.
      return this;
    },

    renderSchedule: function() {
      this.$el.html(this.template());
      this.$('.panel-body').css('height', $(window).height() - 101 - 90);

      this.$('select.schedule-term').addClass('hidden');

      // Hide the name until we have time to style it.
      // Defer autosizing until it's been inserted into the DOM.
      this.$('.schedule-name').hide();
      _.defer(this.autosizeInput);

      this.$('.schedule-name').val(this.model.get('name') || this.namePlaceholder);
      if (this.model.get('name')) {
        this.$('.schedule-name').removeClass('not-replaced');
      }

      return this;
    },

    renderTerms: _.after(2, function() {
      var input = this.$('select.schedule-term');

      app.terms.each(function(term) {
        input.append(this.termTemplate(term.toJSON()));
      }.bind(this));

      _.defer(this.renderSelect2);
    }),

    autosizeInput: function() {
      var input = this.$('.schedule-name');

      if (input.data('autosized') === undefined) {
        input.autosizeInput({space: 10}).show();
      }

      input.data('autosized', true);
    },

    renderSelect2: function() {
      this.$('select.schedule-term').select2({
        placeholder: 'Term'
      })
      .removeClass('hidden');
    },

    addOneCourseOffering: function(model) {
      var view = new app.ScheduleCourseItemView({model: model});
      this.$('.schedule-course-items').append(view.render().el);
    },

    addAllCourseOfferings: function() {
      this.$('.schedule-course-items').html('');
      this.model.get('courseOfferings').each(this.addOneCourseOffering, this);
    },

    handleScheduleNotFound: function(model, error) {
      if (error.status === 404) {
        $('.schedule-container').append(
          '<div class="text-center">' +
            '<h4>Oh no! We couldn\'t find that schedule.</h4>' +
            '<a href="#schedule/new" class="btn btn-primary">Create a schedule</a>' +
          '</div>'
        );
      }
    },

    focusName: function() {
      this.$('.schedule-name').select();
    },

    blurName: function() {
      var input = this.$('.schedule-name');

      if (input.val().trim() === '') {
        // Have to use keyup to trigger the autosize. We listen to keydown.
        input.addClass('not-replaced').val(this.namePlaceholder).keyup();
      } else if (!input.hasClass('not-replaced')) {
        // As long as something was typed, we'll save it.

        this.model.save({
          'name': input.val(),
          'term_id': this.$('.schedule-term').select2('val')
        }, {patch: true});
      }
    },

    typeName: function(event) {
      if (event.keyCode >= 37 && event.keyCode <= 40 || event.keyCode === 8) {
        // Arrow keys
        return;
      } else if (event.keyCode === 13) {
        // Enter
        this.$('.schedule-name').blur();
      } else {
        this.$('.schedule-name').removeClass('not-replaced');
      }
    },

    changeTerm: function() {
      this.model.save({
        term_id: this.$('.schedule-term').select2('val')
      }, {patch: true});
    }
  });

  app.ScheduleView = ScheduleView;
})();
