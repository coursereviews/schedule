var app = app || {};

(function() {
  'use strict';

  var SearchView = Backbone.View.extend({

    events: {
      'keyup .form-control.input-md': 'doSearch',
      'change .form-control': 'doSearch'
    },

    initialize: function() {
      _.bindAll(this, 'renderSelect2');
    },

    render: function() {
      this.$el.html($('#search-template').html());

      this.$('input.time').timepicker({
        showDuration: true,
        timeFormat: 'g:ia',
        step: 5,
        id: 'schedule'
      });

      this.$('.days').addClass('hidden');

      _.defer(this.renderSelect2);

      return this;
    },

    renderSelect2: function() {
      this.$('.days')
        .select2({placeholder: 'Select multiple days'})
        .removeClass('hidden');

      // Once search by mult requirements is implemented this will be useful
      // this.$('.reqs').select2({
      // placeholder: 'Select a requirement'
      // })
      // .removeClass('hidden');
    },

    doSearch: function(e) {

      var self = this;
      var changed = $(e.currentTarget);

      if (changed.prop('tagName') === 'SELECT') {
        changed = changed.find(':selected');
      } else if (changed.prop('tagName') === 'INPUT') {
        changed.attr('value', changed.val());
      }

      self.clearAll(changed);

      if (changed.attr('class') === 'list-group-item' || 'form-control') {

        if ($('.active').length > 0) {
          $('.active').removeClass('active');
        }

        var queries = self.getQueryStrings();
        var courselists = [];
        if (queries.length == 0) { $('.results-list').empty(); }

        queries.forEach(function(query) {
          var newq = [];
          $.ajax({
            method: 'GET',
            url: '/api/catalog/' + query[1],
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
                  self.daysCourseList(r);
                  break;
              }
            }
          });
        });

        function pushtolist(resp) {
          courselists.push(resp);
          if (queries.length == courselists.length && queries.length > 0) {
            self.matchAll(courselists);}
        }
      } else {
        changed.removeClass('active');
      }

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
          if(j!=arg && findProp(courselists[j], 'crn', courselists[arg][i].crn) != -1) {
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

      common.forEach(function(course) { self.addList2(course); });
    },

    addList2: function(course) {
      console.log("displaying something");
      var reslist = this.$('.results-list');
			var view = new app.CourseView( {model: course} );
			this.$('.results-list').append(view.render().el);
		},

    addList: function(course) {
      var view = new app.CourseView({
        model: course
      });
      this.$('.results-list').append(view.render().el);
    },

    offeringDetail: function(offeringObj) {
      // var items = Object.keys(offeringObj)
    },

    newCourseList: function(list) {
      console.log(list);
      list.forEach(function(elmt) {
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
          id: elmt.id
        });
        this.addList(elmt);
      }.bind(this));
    },

    departmentCourseList: function(list) {

      var self = this;
      var professor, description, title, code, term, type, href, faved;
      var schedule = [];
      var location = [];
      var requirements = [];
      var department = list[0].name;
      var courseList = [];
      list[0].courses.forEach(function(elmt) {
        description = elmt.description;
        title = elmt.title;
        code = elmt.code;
        term = elmt.term;
        type = elmt.type;
        href = elmt.href;
        faved = elmt.favorited;
        elmt.courseOfferings.forEach(function(item) {
          professor = item.professors[0].name;

          item.meetings.forEach(function(m) {
            location.push(m.building + ' ' + m.room);
          });

          item.meetings.forEach(function(meet) {
            schedule.push(meet.start_time + ' - ' + meet.end_time + ', ' + meet.days);
          });

         item.requirements.forEach(function(req){
           requirements.push(req.name);
         });

         elmt = new app.CourseModel({
          title: title,
          code: code,
          instructor: professor,
          department: department,
          location: location,
          requirements: requirements,
          term: term,
          type: type,
          schedule: schedule,
          description: description,
          crn: item.crn,
          href: href,
          id: elmt.id,
           favorite:faved,
        });
         courseList.push(elmt);
       });
     });
     return courseList;
   },

    daysCourseList: function(list) {
      $('.results-list').empty();
      var self = this;
      var department = list[0].name;
      list.forEach(function(elmt) {
        var code = elmt.courseOffering.course_code;
        var title = elmt.courseOffering.course.title;
        //  var requirement= 'AAL';
        //  var schedule=[];
        //  elmt.start_time.push(schedule);
        var schedule = elmt.start_time + ' - ' + elmt.end_time + ' ' + elmt.days;
        var location = elmt.building + ' ' + elmt.room;
        var requirement = [];
        var crn = elmt.courseOffering.crn;
        var href = elmt.courseOffering.href;
        var description = elmt.courseOffering.course.description;
        var type = elmt.courseOffering.course.type;
        var profs = [];
        var faved = elmt.favorited;
        elmt.courseOffering.requirements.forEach(function(rq) {
          requirement.push(rq.name);
        });
        elmt.courseOffering.professors.forEach(function(pr) {
          profs.push(pr.name);
        });
        elmt = new app.CourseModel({
          title: title,
          code: code,
          instructor: profs,
          department: department,
          location: location,
          requirements: requirement,
          term: elmt.term,
          type: type,
          schedule: schedule,
          description: description,
          crn: crn,
          href: href,
          id: elmt.id,
          favorited: faved
        });
        self.addList(elmt);
      });
    },

    instructorCourseList: function(list) {
      var self = this;
      var courseList = [];
      list.forEach(function(elmt) {
        var professor = elmt.name;
        elmt.courseOfferings.forEach(function(item) {
          var location = [];
          item.meetings.forEach(function(m) {
            location.push(m.building + ' ' + m.room);
          });
          var requirements = [];
          item.requirements.forEach(function(req) {
            requirements.push(req.name);
          });
          var schedule = [];
          item.meetings.forEach(function(meet) {
            schedule.push(meet.start_time + ' - ' + meet.end_time + ', ' + meet.days);
          });
          elmt = new app.CourseModel({
            title: item.course.title,
            code: item.course.code,
            instructor: professor,
            department: elmt.department,
            location: location,
            requirements: requirements,
            term: item.term.code,
            type: item.course.type,
            schedule: schedule,
            description: item.course.description,
            crn: item.crn,
            href: item.href,
            id: item.id,
            favorited: item.favorited
          });
          courseList.push(elmt);
        });
      });
      return courseList;
    },

    descriptionCourseList: function(list) {
      var self = this;
      var courseList = [];
      list.forEach(function(elmt) {
        var description = elmt.description;
        var title = elmt.title;
        var type = elmt.type;
        var code = elmt.code;
        var department = elmt.department;
        var faved =elmt.favorited;
        elmt.courseOfferings.forEach(function(item) {

          var professors = [];
          item.professors.forEach(function(p) {
            professors.push(p.name);
          });
          var location = [];
          item.meetings.forEach(function(m) {
            location.push(m.building + ' ' + m.room);
          });
          var requirements = [];
          item.requirements.forEach(function(req) {
            requirements.push(req.name);
          });
          var schedule = [];
          item.meetings.forEach(function(meet) {
            schedule.push(meet.start_time + ' - ' + meet.end_time + ', ' + meet.days);
          });

          item = new app.CourseModel({
            title: title,
            code: code,
            instructor: professors,
            department: department,
            location: location,
            requirements: requirements,
            term: item.term.code,
            type: type,
            schedule: schedule,
            description: description,
            crn: item.crn,
            href: item.href,
            id: elmt.id,
            favorite: faved,
          });
          courseList.push(item);

        });

      });
      return courseList;
    },

    reqCourseList: function(list) {
      var self = this;
      var courseList = [];
      list.forEach(function(elmt) {
        var requirement = elmt.name;
        elmt.courseOfferings.forEach(function(item) {
          var location = [];
          item.meetings.forEach(function(m) {
            location.push(m.building + ' ' + m.room);
          });
          var professors = [];
          item.professors.forEach(function(p) {
            professors.push(p.name);
          });

          var schedule = [];
          item.meetings.forEach(function(meet) {
            schedule.push(meet.start_time + ' - ' + meet.end_time + ', ' + meet.days);
          });
          elmt = new app.CourseModel({
            title: item.course.title,
            code: item.course.code,
            instructor: professors,
            department: elmt.department, // undefined
            location: location,
            requirements: requirement,
            term: item.term.code,
            type: item.course.type,
            schedule: schedule,
            description: item.course.description,
            crn: item.crn,
            href: item.href,
            id: elmt.id,
            favorited: elmt.favorited
          });
          courseList.push(elmt);
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
    },

    clearAll: function(newInp) {
        var allinps = [$('#description'),
                       $('#instructor'),
                       $('#loc_select'),
                       $('#subject'),
                       $('[name="start_time"]'),
                       $('[name="end_time"]'),
                       $('#requirements')];
        allinps.forEach(function(inp) {
          if (newInp.attr('id') === 'meeting') {
            if (inp.attr('id') !== 'meeting' && inp.attr('id') !== 'loc_select') {
              inp.val('');
            }
          } else {
            if (inp.attr('id') === 'meeting') {
              inp.val('');
            }
            $('select[class="days form-control"]').select2('val', '');
          }
        });
        $('.results-list').empty();
      }

  });

  app.SearchView = SearchView;
})();
