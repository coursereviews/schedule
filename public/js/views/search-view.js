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
      "click .list-group-item": "doSearch",
      "change .form-control": "doSearch"
    },

    doSearch: function(e) {
      var querystring = 'query/';
      $('.results-list').empty();

      if ($(e.currentTarget).attr('class') == 'list-group-item'){
        if ($('.clicked').length > 0) {$('.clicked').removeClass('clicked');}

        $(e.currentTarget).addClass('clicked');

        //querystring += $(e.currentTarget).attr('id') +'=' +$(e.currentTarget).attr('value');
        var attribute = $(e.currentTarget).attr('id');
        if (attribute == 'subject'){
          querystring += 'department?code' + '=' +$(e.currentTarget).attr('value');
        }

        // console.log(querystring)

        }
        else if ($(e.currentTarget).attr('class') == 'form-control input-md') {
          // $(e.currentTarget).removeClass('clicked'); //???
          $('.clicked').removeClass('clicked'); //???
          var attributeName = $(e.currentTarget).attr('name');
          if (attributeName == "description") {
            querystring += 'course?description=' + document.getElementById('keyword').value.replace(' ','_');
          }

        }

        else {$(e.currentTarget).removeClass('clicked');}

        if (querystring !== "query/") {
          $.ajax({method: 'GET',
                  url: '/api/catalog/'+querystring,
                  dataType: 'json',
                  context: this,
                  success: function(r){
                    if(attribute == 'subject'){
                      this.departmentCourseList(r);
                    }
                    else if(attributeName == 'description') {
                      this.descriptionCourseList(r);
                    }
                    else {
                      this.newCourseList(r);
                    }
                  }
                });
        }

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
        console.log(self);
      });
    },

    descriptionCourseList: function(list){
      console.log("in description f(x)");
      var self = this;

      list.forEach(function(elmt){
        var description = elmt.description;
        var title = elmt.title;
        var type = elmt.type;
        var code = elmt.code;
        var department_id = elmt.department_id;
        var department = elmt.department;

        elmt.courseOfferings.forEach(function(item){

          item = new app.CourseModel({
            title: title,
            code: code,
            instructor: elmt.instructor,//undefined
            department: department,
            location: elmt.location,//undefined
            requirements: elmt.requirements,//undefined
            term: elmt.term,//undefined
            type: type,
            schedule: elmt.schedule, //undefined
            description: description,
            crn: item.crn,
            href: item.href,
          });
          self.addList(item);

        });



        console.log(self);
      });
    }




  });
})();
