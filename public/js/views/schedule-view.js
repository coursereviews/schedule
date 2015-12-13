var app = app || {};

(function() {
  'use strict';

  var ScheduleView = Backbone.View.extend({

    template: _.template($('#schedule-template').html()),

    events: {
      'focus .name': 'focusName',
      'blur .name': 'blurName',
      'keydown .name': 'typeName'
    },

    namePlaceholder: 'Click to name your schedule',

    initialize: function() {
      // Create a new model to represent the schedule.
      // If an id is specified, we'll try to get the model from the server.
      if (app.scheduleId === 'new') {
        this.model = new app.ScheduleModel();
      } else {
        this.model = new app.ScheduleModel({id: app.scheduleId});
      }

      // Bind to the error event before requesting the schedule.
      // So we can handle a 404 nicely.
      this.listenTo(this.model, 'error', this.handleScheduleNotFound);

      // this.listenTo(this.model, 'change sync', this.renderSchedule);

      _.bindAll(this, 'autosizeInput');

      if (!this.model.isNew()) {
        // If we're not creating a new schedule, fetch it.
        this.model.fetch({success: function() {
          this.renderSchedule();
          this.addAllCourseOfferings();
        }.bind(this)});
      } else {
        // Nothing to fetch so we can render the schedule now.
        this.renderSchedule();
      }
    },

    render: function() {
      // Essentially a no-op since ScheduleMainView will render ScheduleView
      // before the schedule has been fetched. We might want to render a not
      // found message instead of the schedule.
      return this;
    },

    renderSchedule: function() {
      this.$el.html(this.template());

      // Hide the name until we have time to style it.
      // Defer autosizing until it's been inserted into the DOM.
      this.$('.name').hide();
      _.defer(this.autosizeInput);

      this.$('.name').val(this.model.get('name') || this.namePlaceholder);
      if (this.model.get('name')) {
        this.$('.name').removeClass('not-replaced');
      }

      return this;
    },

    autosizeInput: function() {
      var input = this.$('.name')

      if (input.data('autosized') === undefined) {
        input.autosizeInput({space: 10}).show();
      }

      input.data('autosized', true);
    },

    addOneCourseOffering: function() {

    },

    addAllCourseOfferings: function() {
      console.log(this.model.get('courseOfferings'));
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
      this.$('.name').select();
    },

    blurName: function() {
      var input = this.$('.name');

      if (input.val().trim() === '') {
        // Have to use keyup to trigger the autosize. We listen to keydown.
        input.addClass('not-replaced').val(this.namePlaceholder).keyup();
      } else if (!input.hasClass('not-replaced')) {
        // As long as something was typed, we'll save it.

        this.model.save({'name': input.val()}, {patch: true});
      }
    },

    typeName: function(event) {
      if (event.keyCode >= 37 && event.keyCode <= 40) {
        // Arrow keys
        return;
      } else if (event.keyCode === 13) {
        // Enter
        this.$('.name').blur();
      } else {
        this.$('.name').removeClass('not-replaced');
      }
    }
  });

  app.ScheduleView = ScheduleView;
})();
