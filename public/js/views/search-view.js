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
      var querystring = 'query/';
      $('.results-list').empty();

      if ($(e.currentTarget).attr('class') == 'list-group-item'){
        if ($('.clicked').length > 0) {$('.clicked').removeClass('clicked');}

        $(e.currentTarget).addClass('clicked');


        var attribute = $(e.currentTarget).attr('id');
        if (attribute == 'subject'){
          querystring += 'department?code' + '=' +$(e.currentTarget).attr('value');
          console.log(querystring);
        }else if (attribute == 'requirements'){
          querystring += 'requirement?name' + '=' +$(e.currentTarget).attr('value');
          console.log(querystring);
        }
        //added by Amanuel starting here

        else if (attribute == 'start_time'){
          querystring += 'meeting?start' + '=' +$(e.currentTarget).attr('value');
          console.log(querystring);
        }
        //  Amanuel's code ends here

        $.ajax({method: 'GET',
                url: '/api/catalog/'+querystring,
                dataType: 'json',
                context: this,
                success: function(r){
                  if(attribute == 'subject'){
                    this.departmentCourseList(r);
                  }

                  this.newCourseList(r);}
              });
        } else {$(e.currentTarget).removeClass('clicked');}
    },

    addList: function(course) {
      var reslist = this.$('.results-list');
			var view = new app.CourseView({model: course});
			this.$('.results-list').append(view.render().el);
		},

    newCourseList: function(list){
      var self = this;
      list.forEach(function(elmt){
        elmt = new app.CourseModel({
          title: elmt.title,
          code: elmt.code,
          instructor: elmt.instructor,
          department: elmt.department,
          location: elmt.location, //needed
          requirements: elmt.requirements, //needed
          term: elmt.term,
          type: elmt.type,
          schedule: elmt.schedule, //needed
          description: elmt.description,
          crn: elmt.crn,  //needed
          href: elmt.href,
        });
        self.addList(elmt);
      });
    },

    departmentCourseList: function(list){
      var self = this;
      var department = list[0].name;
      list[0].courses.forEach(function(elmt){
        elmt = new app.CourseModel({
          title: elmt.title,
          code: elmt.code,
          instructor: elmt.instructor,
          department: department,
          location: elmt.location,
          requirements: elmt.requirements,
          term: elmt.term,
          type: elmt.type,
          schedule: elmt.schedule,
          description: elmt.description,
          crn: elmt.crn,
          href: elmt.href,
        });
        self.addList(elmt);
      });
    }
  });
})();
