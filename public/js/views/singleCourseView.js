// singleCourseView.js
// -------
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var singleCourseView = Backbone.View.extend({

  events: {
    'click': 'clickHeader'
  },

  clickHeader: function(header) {
    if (header.className !== 'col-md-12 open') {
      header.className = 'col-md-12 open';
      header.innerHTML = header.innerHTML;
      // + course-body
    } else {
      header.innerHTML = header.innerHTML;
      header.className = 'col-md-12';
    }
  },

  template: _.template($('#courseElement').html()),

  render: function() {
    var courseTemplate = this.template(this.model.toJSON());
    this.$el.html(courseTemplate);
    return this;
  }
});
