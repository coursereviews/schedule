'use strict';

const path = require('path');
const Bookshelf = require('../settings/db');
const catalog = require('middlebury-catalog');

const Department = require('../models/department');
const Professor = require('../models/professor');
const Course = require('../models/course');
const Term = require('../models/term');
const CourseOffering = require('../models/courseoffering');
const Requirement = require('../models/requirement');
const Meeting = require('../models/meeting');
const Promise = require('bluebird');

catalog('201590')
.catalogFromFile(path.join(__dirname, '/../../test/test.xml'))
.then(function (catalog) {
  return createCourse(catalog.courses[0]);
})
.then(function () {
  Bookshelf.knex.destroy();
})
// .catch(function (err) {
//   Bookshelf.knex.destroy();
//   throw new Error(err);
// })

function createCourse(course) {
  return getOrCreateProfessors(course.instructors).bind({})
  .then(function (professors) {
    this.professors = professors;

    return getOrCreateDepartment(course.department);
  })
  .then(function(department) {
    this.department = department;

    return getOrCreateCourse(course, this.department);
  })
  .then(function(courseModel) {
    this.course = courseModel;

    return getOrCreateTerm(course.term);
  })
  .then(function(term) {
    this.term = term;

    return getOrCreateRequirements(course.requirements);
  })
  .then(function(requirements) {
    this.requirements = requirements;

    return createCourseOffering(course, this);
  })
}

function getOrCreateProfessors(instructors) {
  return Promise.map(instructors, function(instructor) {
    let p = new Professor({midd_id: instructor.id});

    return p.fetch()
    .then(function(model) {
      if (model) {
        return model;
      }

      p.name = instructor.name;
      return p.save();
    });
  });
}

function getOrCreateRequirements(requirements) {
  return Promise.map(requirements, function(requirement) {
    let r = new Requirement({code: requirement.id});

    return r.fetch()
    .then(function(model) {
      if (model) {
        return model;
      }

      r.name = requirement.text;
      return r.save();
    });
  });
}

function getOrCreateDepartment(department) {
  let d = new Department({code: department.id});

  return d.fetch()
  .then(function(model) {
    if (model) {
      return model;
    }

    d.name = department.text;
    return d.save();
  });
}

function getOrCreateCourse(course, department) {
  let c = new Course({code: course.code.slice(0, 8)});

  return c.fetch()
  .then(function(model) {
    if (model) {
      return model;
    }

    let newCourse = {
      code: course.code.slice(0, 8),
      title: course.title,
      description: course.description,
      type: course.type.text
    };

    return department.courses().create(newCourse);
  });
}

function getOrCreateTerm(term) {
  let t = new Term({code: term.id});

  return t.fetch()
  .then(function(model) {
    if (model) {
      return model;
    }

    return t.save();
  });
}

function createCourseOffering(course, context) {
  let c = new CourseOffering({
    course_code: course.code,
    href: course.href,
    crn: course.crn.id
  });

  return Promise.all([
    context.term.courseOfferings().add(c),
    context.course.courseOfferings().add(c)
  ])
  .then(function(thing) {
    console.log(thing);
    return Promise.map(context.requirements, function(requirement) {
      requirement.courseOfferings().attach(c);
    });
  })
  .then(function() {
    return Promise.map(context.professors, function(professor) {
      professor.courseOfferings().attach(c);
    });
  })
  .then(function() {
    return c.save();
  })
  .then(function(savedCourseOffering) {
    return Promise.map(course.schedule.meetings, function(meeting) {
      return savedCourseOffering.related('meetings').create({
        start_time: meeting.startTime.format('h:mma'),
        end_time: meeting.endTime.format('h:mma'),
        start_date: meeting.startDate.format('MMM DD, YYYY'),
        end_date: meeting.endDate.format('MMM DD, YYYY'),
        days: meeting.days.join(','),
        room: meeting.room,
        building: meeting.building
      });
    });
  })
  //
  // context.course.related('courseOfferings').add(c);
  // context.requirements.forEach(function(requirement) {
  //   c.related('requirements').add(requirement);
  // });
  // context.professors.forEach(function(professor) {
  //   c.related('professors').add(professor);
  // });

  // return c.save()
  // .then(function(savedCourseOffering) {
  //   return Promise.map(course.schedule.meetings, function(meeting) {
  //     return savedCourseOffering.related('meetings').create({
  //       start_time: meeting.startTime.format('h:mma'),
  //       end_time: meeting.endTime.format('h:mma'),
  //       start_date: meeting.startDate.format('MMM DD, YYYY'),
  //       end_date: meeting.endDate.format('MMM DD, YYYY'),
  //       days: meeting.days.join(','),
  //       room: meeting.room,
  //       building: meeting.building
  //     });
  //   });
  // });
}
