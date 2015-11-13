'use strict';

const path = require('path');
const Bookshelf = require('../settings/db');
const catalog = require('middlebury-catalog');

const Department = require('../models/department');
const Professor = require('../models/professor');
const Course = require('../models/course')
const Promise = require('bluebird');

catalog('201590')
.catalogFromFile(path.join(__dirname, '/../../test/test.xml'))
.then(function (catalog) {
  return createCourse(catalog.courses[0]);
})
.then(function () {
  Bookshelf.knex.destroy();
})
.catch(function (err) {
  Bookshelf.knex.destroy();
  throw new Error(err);
})

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

    console.log(this);
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

      p.name = instructor.name;
      return p.save();
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
