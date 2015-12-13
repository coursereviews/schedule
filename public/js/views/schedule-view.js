var app = app || {};

(function() {
  'use strict';

  var ScheduleView = Backbone.View.extend({

    template: _.template($('#schedule-template').html()),

    events: {

    },

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

      this.listenTo(this.model, 'change', this.renderSchedule);

      if (!this.model.isNew()) {
        // If we're not creating a new schedule, fetch it.
        this.model.fetch({success: function() {
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

      console.log(this.model);

      return this;
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
    }
  });

  app.ScheduleView = ScheduleView;
})();
