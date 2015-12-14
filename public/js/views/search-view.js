var app = app || {};

(function() {
  'use strict';

  app.SearchView = Backbone.View.extend({

    events: {
      'keydown .form-control': 'doSearch',
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

      var changed = $(e.currentTarget);

      if (changed.prop('tagName') === 'SELECT') {
        changed = changed.find(':selected');
      } else if (changed.prop('tagName') === 'INPUT') {
        changed.attr('value', changed.val());
      }

      var querystring = 'query/';
      this.clearAll(changed);

      if (changed.attr('class') === 'list-group-item' || 'form-control') {

        if ($('.active').length > 0) {
          $('.active').removeClass('active');
        }

        var attribute = changed.attr('id');

        if (attribute === 'subject') {
          querystring += 'department?code' + '=' + changed.attr('value');
        } else if (attribute === 'description') {
          querystring += 'course?description=' + changed.attr('value').replace(' ', '_');
        } else if (attribute === 'instructor') {
          querystring += 'professor?name=' + changed.attr('value').replace(' ', '_');
        } else if (attribute === 'requirements') {
          querystring += 'requirement?code=' + changed.attr('value');
        } else if (attribute === 'meeting') {
          var meetInputs = [$('#loc_select'),
                            $('[name="start_time"]'),
                            $('[name="end_time"]'),
                            $('[name="days"]')];
          querystring += 'meeting?';
          meetInputs.forEach(function(inp) {
            if (inp.val() !== '' && inp.val() !== null) {
              querystring += '&' + inp.attr('name') + '=' + inp.val();
            }
          });
        }

        $.ajax({
          method: 'GET',
          url: '/api/catalog/' + querystring,
          dataType: 'json',
          context: this,
          success: function(r) {

            switch (attribute) {
              case 'subject':
                this.departmentCourseList(r);
                break;
              case 'description':
                this.descriptionCourseList(r);
                break;
              case 'instructor':
                this.instructorCourseList(r);
                break;
              case 'requirements':
                this.reqCourseList(r);
                break;
              case 'meeting':
                this.daysCourseList(r);
                break;
              default:
                this.newCourseList(r);
            }
          }
        });
      } else {
        changed.removeClass('active');
      }

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
        });
        this.addList(elmt);
      }.bind(this));
    },

    departmentCourseList: function(list) {
      var self = this;
      var professor, description, title, code, term, type, href;
      var schedule = [];
      var location = [];
      var requirements = [];
      var department = list[0].name;
      list[0].courses.forEach(function(elmt) {
        description = elmt.description;
        title = elmt.title;
        code = elmt.code;
        term = elmt.term;
        type = elmt.type;
        href = elmt.href;

        elmt.courseOfferings.forEach(function(item) {
          professor = item.professors[0].name;

          item.meetings.forEach(function(m) {
            location.push(m.building + ' ' + m.room);
          });

          item.meetings.forEach(function(meet) {
            schedule.push(meet.start_time + ' - ' + meet.end_time + ', ' + meet.days);
          });

          item.requirements.forEach(function(req) {
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
          });
          self.addList(elmt);
        });
      });
    },

    daysCourseList: function(list) {
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
        });
        self.addList(elmt);
      });
    },

    instructorCourseList: function(list) {
      var self = this;
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
          });
          self.addList(elmt);
        });
      });
    },

    descriptionCourseList: function(list) {
      var self = this;
      list.forEach(function(elmt) {
        var description = elmt.description;
        var title = elmt.title;
        var type = elmt.type;
        var code = elmt.code;
        var department = elmt.department;

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
          });
          self.addList(item);

        });

      });
    },

    reqCourseList: function(list) {
      var self = this;
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
          });
          self.addList(elmt);
        });
      });
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
          if (inp.attr('id') !== newInp.attr('id')) {
            inp.val('');
          }
          $('select[class="days form-control"]').select2('val', '');
        }
      });
      $('.results-list').empty();
    }

  });
})();
