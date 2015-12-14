var app = app || {};

(function() {
  'use strict';

  var ScheduleCourseItemView = Backbone.View.extend({
    tagName: 'div',

    className: 'schedule-course-item',

    template: _.template($('#schedule-course-block-template').html()),

    scheduleStartTime: '7:30am',
    scheduleEndTime: '10:00pm',

    timeFormat: 'h:mma',

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

      block.css('top', this.timeOffset(meeting.start_time));
      block.css('height', (this.timeOffset(meeting.end_time) - this.timeOffset(meeting.start_time)));
      block.css('left', this.dayOffset(day));

      var colors = ['#fb9a99', '#a6cee3', '#66AFE0', '#ffff99', '#b15928',
                    '#e31a1c', '#cab2d6', '#9263C4', '#b2df8a', '#33a02c',
                    '#FFB237', '#fdbf6f'];

      this.color = colors[app.courseOfferings.indexOf(this.model) % 12];

      block.css('background-color', this.color);
      return block;
    },

    renderOneCourseMeeting: function(meeting) {
      meeting.days.split(',').forEach(function(day) {
        this.$el.append(this.renderOneCourseBlock(meeting, day));
      }.bind(this));
    },

    dayOffset: function(day) {
      var dayWidth = $('.schedule-container .panel-body').width() / 5;

      return ['Monday', 'Tuesday', 'Wednesday',
              'Thursday', 'Friday'].indexOf(day) * dayWidth;
    },

    timeOffset: function(time) {
      var totalHeight = $('.schedule-container .day.friday').innerHeight();
      var scheduleStartTime = moment(this.scheduleStartTime, this.timeFormat);
      var scheduleEndTime = moment(this.scheduleEndTime, this.timeFormat);
      var totalScheduleTime = scheduleEndTime - scheduleStartTime;
      var normalizedTime = moment(time, this.timeFormat) - scheduleStartTime;


      return (normalizedTime / totalScheduleTime) * totalHeight;
    },

    mouseoverBlock: function() {
      this.$('.schedule-course-block')
        .addClass('hover')
        .css('border-color', this.darkenColor(this.color, -50));
    },

    mouseoutBlock: function() {
      this.$('.schedule-course-block')
        .removeClass('hover')
        .css('border-color', 'transparent');
    },

    // https://css-tricks.com/snippets/javascript/lighten-darken-color
    darkenColor: function(col, amt) {
      var usePound = true;
      if (col[0] === '#') {
        col = col.slice(1);
        usePound = true;
      }

      var num = parseInt(col, 16);
      var r = (num >> 16) + amt;
      var g = (num & 0x0000FF) + amt;
      var b = ((num >> 8) & 0x00FF) + amt;

      if (r > 255) r = 255;
      else if (r < 0) r = 0;

      if (g > 255) g = 255;
      else if (g < 0) g = 0;

      if (b > 255) b = 255;
      else if (b < 0) b = 0;

      return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
    }

  });

  app.ScheduleCourseItemView = ScheduleCourseItemView;
})();
