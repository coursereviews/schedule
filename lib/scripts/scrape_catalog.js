/* global -Promise */

'use strict';

const Bookshelf = require('../settings/db');
const catalog = require('middlebury-catalog');

const Department = require('../models/department');
const Professor = require('../models/professor');
const Course = require('../models/course');
const Term = require('../models/term');
const CourseOffering = require('../models/courseoffering');
const Requirement = require('../models/requirement');

catalog('201590')
.catalogFromUrl()
.then(function(catalog) {
  return Promise.each(catalog.courses, createCourse);
})
.then(function() {
  Bookshelf.knex.destroy();
});

function createCourse(course) {
  return getOrCreateProfessors(course.instructors).bind({})
  .then(function(professors) {
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
  });
}

function getOrCreateProfessors(instructors) {
  return Promise.map(instructors, function(instructor) {
    let p = new Professor({midd_id: instructor.id});

    return p.fetch()
    .then(function(model) {
      if (model) {
        return model;
      }

      p.set('name', instructor.name);
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

      r.set('name', requirement.text);
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

    d.set('name', department.text);
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
  return CourseOffering.forge({
    course_code: course.code,
    href: course.href,
    crn: course.crn.id,
    term_id: context.term.id,
    course_id: context.course.id
  })
  .save()
  .tap(function(courseOffering) {
    return Promise.each(context.requirements, function(req) {
      return courseOffering.requirements().attach(req.id);
    });
  })
  .tap(function(courseOffering) {
    return Promise.each(context.professors, function(prof) {
      return courseOffering.professors().attach(prof.id);
    });
  })
  .then(function(courseOffering) {
    return Promise.each(course.schedule.meetings, function(meeting) {
      return courseOffering.meetings().create({
        start_time: meeting.startTime.format('h:mma'),
        end_time: meeting.endTime.format('h:mma'),
        start_date: meeting.startDate.format('MMM DD, YYYY'),
        end_date: meeting.endDate.format('MMM DD, YYYY'),
        days: meeting.days.join(','),
        room: meeting.room,
        building: meeting.building
      });
    });
  });
}
