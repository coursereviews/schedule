var app = app || {};

(function() {
  'use strict';

  app.SearchView = Backbone.View.extend({

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html($("#search-template").html());
      return this;
    },

    events: {
      "click .list-group-item": "doSearch"
    },

    doSearch: function(e) {
      var querystring = 'query?' +$(e.currentTarget).attr('id');
      $.ajax({
        method: 'GET',
        url: '/api/catalog/'+querystring,
        dataType: 'json',
        context: this,
        success: function(r){this.newCourseList(r);}
      });
    },

    addOne: function(course) {
			var view = new app.CourseView({model: course});
      var reslist = this.$('.results-list');
      //console.log(reslist);
			this.$('.results-list').append(view.render().el);
		},

    addAll: function() {

    },

    newCourseList: function(list){
      var self = this;
      list.forEach(function(elmt){
        elmt = new app.CourseModel({
          title: elmt.title,
          code: elmt.code,
          instructor: elmt.instructor,
          department: elmt.department,
          location: elmt.location,
          requirements: elmt.requirements,
          term: elmt.term,
          type: elmt.type,
          schedule: elmt.schedule
        });
        self.addOne(elmt);
      });
    }
  });
})();
