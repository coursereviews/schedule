var app = app || {};

(function() {
  'use strict';

  app.SearchView = Backbone.View.extend({

    initialize: function() {
      _.bindAll(this, 'renderSelect2');
    },

    render: function() {
      this.$el.html($("#search-template").html());

      this.$('input.time').timepicker({
        showDuration: true,
        timeFormat: 'g:ia',
        step: 5,
        id: "schedule"
      });

      this.$('.days').addClass('hidden');

      _.defer(this.renderSelect2);

      return this;
    },

    renderSelect2: function() {
      this.$('.days').select2({
        placeholder: 'Select multiple days'
      })
      .removeClass('hidden');
    },

    events: {
      "change .form-control": "doSearch"
    },

    doSearch: function(e) {
      var self = this;

      var changed = $(e.currentTarget);

      if (changed.prop("tagName") === "SELECT") { changed = changed.find(":selected"); }
      else if (changed.prop("tagName") === "INPUT") { changed.attr('value', changed.val()) }

      if (changed.attr('class') === 'list-group-item' || 'form-control') {

        if ($('.active').length > 0) {$('.active').removeClass('active');}

        var queries = this.getQueryStrings();
        var courselists = [];
        if (queries.length == 0) { $('.results-list').empty(); }

        queries.forEach(function(query) {
          var newq = [];
          $.ajax({method: 'GET',
                  url: '/api/catalog/'+query[1],
                  dataType: 'json',
                  success: function(r) {
                  switch (query[0]) {
                    case 'subject':
                      pushtolist(self.departmentCourseList(r));
                      break;
                    case 'description':
                      pushtolist(self.descriptionCourseList(r));
                      break;
                    case 'instructor':
                      pushtolist(self.instructorCourseList(r));
                      break;
                    case 'requirements':
                      pushtolist(self.reqCourseList(r));
                      break;
                    case 'meeting':
                      pushtolist(self.daysCourseList(r));
                      break;
                  }
                }
              });
            });

        function pushtolist(resp) {
          courselists.push(resp);
          if (queries.length == courselists.length) {self.matchAll(courselists);}
        }

        } else { changed.removeClass('active'); }

    },

    matchAll: function(courselists) {
      var self = this;
      $('.results-list').empty();
      var min; var arg = 0; var index = 0;
      var common = [];
      for (var i=0; i<courselists.length; i++){
        min = courselists[i].length;
        arg = i;
      }
      for (var i=0; i<courselists[arg].length; i++){
        for (var j=0; j<courselists.length; j++){
          if(j!=arg && findProp(courselists[j], 'code', courselists[arg][i].code) != -1) {
            index++;
          }
        }
        if(index == courselists.length-1){
          common.push(courselists[arg][i]);
        }
        index = 0;
      }

      function findProp(array, attr, value) {
        for(var i = 0; i < array.length; i += 1) {
          if(array[i][attr] === value) { return i; }
        }
        return -1;
      }

      common.forEach(function(course) { self.addList(course); });
    },

    addList: function(course) {
      var reslist = this.$('.results-list');
      var newcourse = new app.CourseModel({
          title: course.title,
          code: course.code,
          instructor: course.instructor,
          department: course.department,
          location: course.location,
          requirements: course.requirements,
          term: course.term,
          type: course.type,
          schedule: course.schedule,
          description: course.description,
          crn: course.crn,
          href: course.href,
        });
			var view = new app.CourseView( {model: newcourse} );
			this.$('.results-list').append(view.render().el);
		},

    daysCourseList: function(list) {
      var courseList = [];
      var self = this;
      // var department = list[0].name;
      list.forEach(function(elmt) {
        var code = elmt.courseOffering.course_code;
        var title = elmt.courseOffering.course.title;
        var schedule = elmt.start_time + ' - ' + elmt.end_time + ' ' + elmt.days;
        var location = elmt.building + ' ' + elmt.room;
        var requirements = [];
        var crn = elmt.courseOffering.crn;
        var href = elmt.courseOffering.href;
        var department = elmt.courseOffering.course.department.name;
        var description = elmt.courseOffering.course.description;
        var type = elmt.courseOffering.course.type;
        var profs = [];
        elmt.courseOffering.requirements.forEach(function(rq) {
          requirements.push(rq.name);
        });
        elmt.courseOffering.professors.forEach(function(pr) {
          profs.push(pr.name);
        });
        var courseObj = {
          title: title,
          code: code,
          instructor: profs,
          department: department,
          location: location,
          requirements: requirements,
          term: elmt.term, //undefined
          type: type,
          schedule: schedule,
          description: description,
          crn: crn,
          href: href,
        };
        courseList.push(courseObj);
      });
      console.log(courseList);
      return courseList;
    },

    departmentCourseList: function(list){
      var self = this;
      //var professor;
      //var crn;
      // var schedule = [];
      // var location = [];
      // var requirements = [];
      var department = list[0].name;
      var courseList = [];
      list[0].courses.forEach(function(elmt){
        //var department = elmt.name;

        elmt.courseOfferings.forEach(function(item){

          var location = [];
          item.meetings.forEach(function(m){
            location.push(m.building+' '+m.room);
          });
          var requirements = [];
          item.requirements.forEach(function(req){
            requirements.push(req.name);
          });
          var schedule = [];
          item.meetings.forEach(function(meet){
            schedule.push(meet.start_time+" - "+meet.end_time+", "+meet.days);
          });
          var professors = [];
          item.professors.forEach(function(p){
            professors.push(p.name);
          });

          // professor = item.professors[0]['name'];
          //
          // item.meetings.forEach(function(m){
          //   location.push(m.building+' '+m.room);
          // });

          // item.meetings.forEach(function(meet){
          //   schedule.push(meet.start_time+" - "+meet.end_time+", "+meet.days);
          // });
          // requirements = item.requirements[0].name;
          //
          // item.requirements.forEach(function(req){
          //   requirements.push(req.name);
          // });

          var courseObj = {
            title: elmt.title,
            code: elmt.code,
            instructor: professors,
            department: department,
            location: location,
            requirements: requirements,
            term: item.term.code,
            type: elmt.type,
            schedule: schedule,
            description: elmt.description,
            crn: item.crn,
            href: item.href,
          };

          courseList.push(courseObj);
          });
        });
      return courseList;
    },

    instructorCourseList: function(list){
      var self = this;
      var courseList = [];
      list.forEach(function(elmt) {
        var professor = elmt.name;
        elmt.courseOfferings.forEach(function(item){
          var location = [];
          item.meetings.forEach(function(m){
            location.push(m.building+' '+m.room);
          });
          var requirements = [];
          item.requirements.forEach(function(req){
            requirements.push(req.name);
          });
          var schedule = [];
          item.meetings.forEach(function(meet){
            schedule.push(meet.start_time+" - "+meet.end_time+", "+meet.days);
          });
          var courseObj = {
            title: item.course.title,
            code: item.course.code,
            instructor: professor,
            department: elmt.department, //undefined
            location: location,
            requirements: requirements,
            term: item.term.code,
            type: item.course.type,
            schedule: schedule,
            description: item.course.description,
            crn: item.crn,
            href: item.href,
          };
          courseList.push(courseObj);
        });
      });
      return courseList;
    },

    descriptionCourseList: function(list){
      var self = this;
      var courseList = [];
      list.forEach(function(elmt){
        var description = elmt.description;
        var title = elmt.title;
        var type = elmt.type;
        var code = elmt.code;
        // var department_id = elmt.department_id;
        var department = elmt.department;

        elmt.courseOfferings.forEach(function(item){

          var professors = [];
          item.professors.forEach(function(p){
            professors.push(p.name);
          });
          var location = [];
          item.meetings.forEach(function(m){
            location.push(m.building+' '+m.room);
          });
          var requirements = [];
          item.requirements.forEach(function(req){
            requirements.push(req.name);
          });
          var schedule = [];
          item.meetings.forEach(function(meet){
            schedule.push(meet.start_time+" - "+meet.end_time+", "+meet.days);
          });

          var courseObj = {
            title: title,
            code: code,
            instructor: professors,//undefined
            department: department,
            location: location,//undefined
            requirements: requirements,//undefined
            term: item.term.code,//undefined
            type: type,
            schedule: schedule, //undefined
            description: description,
            crn: item.crn,
            href: item.href,
          };
          courseList.push(courseObj);

        });

      });
      return courseList;
    },

    reqCourseList: function(list){
      var self = this;
      var courseList = [];
      list.forEach(function(elmt) {
        var requirement = elmt.name;
        elmt.courseOfferings.forEach(function(item){
          var location = [];
          item.meetings.forEach(function(m){
            location.push(m.building+' '+m.room);
          });
          var professors = [];
          item.professors.forEach(function(p){
            professors.push(p.name);
          });

          var schedule = [];
          item.meetings.forEach(function(meet){
            schedule.push(meet.start_time+" - "+meet.end_time+", "+meet.days);
          });
          var courseObj = {
            title: item.course.title,
            code: item.course.code,
            instructor: professors,
            department: elmt.department, //undefined
            location: location,
            requirements: requirement,
            term: item.term.code,
            type: item.course.type,
            schedule: schedule,
            description: item.course.description,
            crn: item.crn,
            href: item.href,
          };
          courseList.push(courseObj);
        });
      });
      return courseList;
    },

    getQueryStrings: function(){
      var queries = [];
      var allinps = [$("#description"), $("#instructor"), $("#loc_select").children(":first"), $("#subject"),
                     $("[name='start_time']"), $("[name='end_time']"), $("#requirements")];
      allinps.forEach(function(inp) {
        var querystring = 'query/';
        if (inp.val() !== '') {
          if (inp.attr('id') == 'subject'){
            querystring += 'department?code' + '=' +inp.val();
          } else if (inp.attr('id') == 'description') {
            querystring += 'course?description=' + inp.val().replace(' ','_');
          } else if (inp.attr('id') == 'instructor') {
            querystring += 'professor?name=' + inp.val().replace(' ','_');
          } else if (inp.attr('id') == 'requirements') {
            querystring += 'requirement?code=' + inp.val().replace(' ','_');
          } else if (inp.attr('id') == 'meeting') {
            var meetInputs = [$("#loc_select"), $("[name='start_time']"), $("[name='end_time']"), $("[name='days']")];
            querystring += "meeting?";
            meetInputs.forEach(function(inp) {
              if (inp.val() !== '' &&  inp.val() !== null) {
              querystring += '&' +inp.attr('name') +'=' +inp.val();} });
          }
          queries.push([inp.attr('id'), querystring]);
        }
      });
      var uniqueQueries = [];
      $.each(queries, function(i, el){
        if($.inArray(el, uniqueQueries) === -1) uniqueQueries.push(el);
      });
      return uniqueQueries;
    }

  });
})();
