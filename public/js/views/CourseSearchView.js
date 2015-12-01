// CourseSearchView.js
// -------
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var CourseSearchView = Backbone.View.extend({

  render: function(){
    this.collection.each(this.addCourse, this);
    return this;
  },

  addCourse: function(course){
    var courseView = new singleCourseView({model:course});
    this.$el.append(courseView.render().el);
  }

});
