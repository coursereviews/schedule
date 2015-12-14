var app = app || {};

(function() {
  'use strict';

  var ScheduleCourseItemView = Backbone.View.extend({
    tagName: 'div',

    className: 'schedule-course-item',

    template: _.template($('#schedule-course-block-template').html()),

    scheduleStartTime: '7:30am',
    scheduleEndTime: '10:30pm',

    timeFormat: 'hh:mma',

    events: {
      'mouseover .schedule-course-block': 'mouseoverBlock',
      'mouseout .schedule-course-block': 'mouseoutBlock'
    },

    render: function() {
      this.model.get('meetings').forEach(this.renderOneCourseMeeting, this);
      return this;
    },

    renderOneCourseBlock: function(meeting, day) {
      var block = $(this.template({
        title: this.model.get('course').code,
        meeting: meeting
      }));

      block.css('top', this.timeOffset(meeting.start_time) + 1 /* border */);
      block.css('height', (this.timeOffset(meeting.end_time) - this.timeOffset(meeting.start_time)) * 2);
      block.css('left', this.dayOffset(day) + 1 /* border */);

      return block;
    },

    renderOneCourseMeeting: function(meeting) {
      meeting.days.split(',').forEach(function(day) {
        this.$el.append(this.renderOneCourseBlock(meeting, day));
      }.bind(this));
    },

    dayOffset: function(day) {
      var dayWidth = $('.schedule-container').width() / 5;

      return ['Monday', 'Tuesday', 'Wednesday',
              'Thursday', 'Friday'].indexOf(day) * dayWidth;
    },

    timeOffset: function(time) {
      var totalHeight = $('.schedule-container').height();
      var scheduleStartTime = moment(this.scheduleStartTime, this.timeFormat);
      var scheduleEndTime = moment(this.scheduleEndTime, this.timeFormat);
      var totalScheduleTime = scheduleEndTime - scheduleStartTime;
      var normalizedTime = moment(time, this.timeFormat) - scheduleStartTime;

      return (normalizedTime / totalScheduleTime) * totalHeight;
    },

    mouseoverBlock: function() {
      this.$('.schedule-course-block').addClass('hover');
    },

    mouseoutBlock: function() {
      this.$('.schedule-course-block').removeClass('hover');
    }

  });

  app.ScheduleCourseItemView = ScheduleCourseItemView;
})();
