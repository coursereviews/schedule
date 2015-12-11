'use strict';

const Course = require('../../models/course.js');
const CourseOffering = require('../../models/courseoffering.js');
const Department = require('../../models/department.js');
const ExtraCurricular = require('../../models/extracurricular.js');
const Meeting = require('../../models/meeting.js');
const Professor = require('../../models/professor.js');
const Requirement = require('../../models/requirement.js');
const Term = require('../../models/term.js');


// get course queries and run them
// these queries return the 'course' objects with all related relations
exports.courseQuery = function(req, res) {
  var queryObj = req.query;

  // replace all underscores with spaces
  Object.keys(queryObj).forEach(function(key) {
    // Thanks to Tony for the check for strings vs. arrays

    if (typeof queryObj[key] === 'string') {
      // if value isn't an array
      queryObj[key] = queryObj[key].replace(/_/g, ' ');
    } else {
      // if value is an array
      queryObj[key].forEach(function(item) {
        item = item.replace(/_/g, ' ');
      });
    }


  });
// can just iterate over the keys and values and put in where instructions
  var queryModel = new Course(queryObj);
  var queryKey = Object.keys(queryObj);


  queryModel.query(function(qb){
    //fuzzy search
    queryKey.forEach(function(key){
      //if the value is a string
      if(typeof queryObj[key] === 'string') {
        qb.where(key,'LIKE',"% "+queryObj[key]+" %"); //doesn't return if the key is a part of another word
      }
      //if the value is an array
      else {
        for (var index=0;index<queryObj[key].length;index++) {
          qb.where(key,'LIKE',"% "+queryObj[key][index]+" %"); //doesn't return if the key is a part of another word
        }
      }
    });

  }).fetchAll()
  .then(function(results) {

    var resultList = [];
    var len = results.models.length;
    results.models.forEach(function(model, i) {
      model.fetch({withRelated: ['department', 'courseOfferings']})
      .then(function(course) {
        resultList.push(course.toJSON());
        if (i === len - 1) {
          res.send(resultList);
          return resultList;
        }
      });
    });

  });
};

// get courseOffering queries and run them
// these queries return the 'courseOffering' objects with all related relations
exports.courseOfferingQuery = function(req, res) {
  var queryObj = req.query;
  var queryModel = new CourseOffering(queryObj);

  queryModel.query({where: queryObj}).fetchAll()
  .then(function(results) {

    var resultList = [];
    var len = results.models.length;
    results.models.forEach(function(model, i) {
      model.fetch({withRelated: ['course', 'term', 'professors', 'schedules',
       'requirements', 'meetings']})
      .then(function(cOff) {
        // console.log(Object.keys(cOff.relations));
        resultList.push(cOff.toJSON());
        if (i === len - 1) {
          res.send(resultList);
          return resultList;
        }
      });
    });

  });
};


// get department queries and run them
// these queries return the 'department' objects and thier relations
exports.departmentQuery = function(req, res) {
  var queryObj = req.query;

  // replace all underscores with spaces
  Object.keys(queryObj).forEach(function(key) {
    // Thanks to Tony for the check for strings vs. arrays

    if (typeof queryObj[key] === 'string') {
      // if value isn't an array
      queryObj[key] = queryObj[key].replace(/_/g, ' ');
    } else {
      // if value is an array
      queryObj[key].forEach(function(item) {
        item = item.replace(/_/g, ' ');
      });
    }
  });

  var queryModel = new Department(queryObj);

  queryModel.query({where: queryObj}).fetchAll()
  .then(function(results) {

    var resultList = [];
    var len = results.models.length;
    results.models.forEach(function(model, i) {
      model.fetch({withRelated: ['courses']})
      .then(function(dept) {
        resultList.push(dept.toJSON());
        if (i === len - 1) {
          res.send(resultList);
          return resultList;
        }
      });
    });

  });
};

// get extracurricular queries and run them
// these queries return the 'extra_curricular' objects with all related relations
exports.extraCurricularQuery = function(req, res) {
  var queryObj = req.query;

  // replace all underscores with spaces
  Object.keys(queryObj).forEach(function(key) {
    // Thanks to Tony for the check for strings vs. arrays

    if (typeof queryObj[key] === 'string') {
      // if value isn't an array
      queryObj[key] = queryObj[key].replace(/_/g, ' ');
    } else {
      // if value is an array
      queryObj[key].forEach(function(item) {
        item = item.replace(/_/g, ' ');
      });
    }
  });

  var queryModel = new ExtraCurricular(queryObj);

  queryModel.query({where: queryObj}).fetchAll()
  .then(function(results) {

    var resultList = [];
    var len = results.models.length;
    results.models.forEach(function(model, i) {
      model.fetch({withRelated: ['user', 'schedules']})
      .then(function(exCur) {
        resultList.push(exCur.toJSON());
        if (i === len - 1) {
          res.send(resultList);
          return resultList;
        }
      });
    });

  });
};

// get meeting queries and run them
// these queries return the 'meeting' objects with all related relations
exports.meetingQuery = function(req, res) {
  var queryObj = req.query;

  // replace all underscores with spaces
  Object.keys(queryObj).forEach(function(key) {
    // Thanks to Tony for the check for strings vs. arrays

    if (typeof queryObj[key] === 'string') {
      // if value isn't an array
      queryObj[key] = queryObj[key].replace(/_/g, ' ');
    } else {
      // if value is an array
      queryObj[key].forEach(function(item) {
        item = item.replace(/_/g, ' ');
      });
    }
  });

  var queryModel = new Meeting(queryObj);
  // --------------------
  // NEEDS FIXING!
  queryModel.query({where: queryObj}).fetchAll()
  .then(function(results) {

    var resultList = [];
    var len = results.models.length;
    results.models.forEach(function(model, i) {
      model.fetch({withRelated: ['courseOffering', 'days']})
      .then(function(mtng) {
        resultList.push(mtng.toJSON());
        if (i === len - 1) {
          res.send(resultList);
          return resultList;
        }
      });
    });

  });
  // --------------------
};

// get professor queries and run them
// these queries return the 'professor' objects with all related relations
exports.professorQuery = function(req, res) {
  var queryObj = req.query;

  // replace all underscores with spaces
  Object.keys(queryObj).forEach(function(key) {
    // Thanks to Tony for the check for strings vs. arrays

    if (typeof queryObj[key] === 'string') {
      // if value isn't an array
      queryObj[key] = queryObj[key].replace(/_/g, ' ');
    } else {
      // if value is an array
      queryObj[key].forEach(function(item) {
        item = item.replace(/_/g, ' ');
      });
    }
  });

  var queryModel = new Professor(queryObj);

  queryModel.query({where: queryObj}).fetchAll()
  .then(function(results) {

    var resultList = [];
    var len = results.models.length;
    results.models.forEach(function(model, i) {
      model.fetch({withRelated: ['courseOfferings']})
      .then(function(prof) {
        resultList.push(prof.toJSON());
        if (i === len - 1) {
          res.send(resultList);
          return resultList;
        }
      });
    });

  });
};

// get requirement queries and run them
// these queries return the 'requirement' objects with all related relations
exports.requirementQuery = function(req, res) {
  var queryObj = req.query;
  var queryModel = new Requirement(queryObj);

  queryModel.query({where: queryObj}).fetchAll()
  .then(function(results) {

    var resultList = [];
    var len = results.models.length;
    results.models.forEach(function(model, i) {
      model.fetch({withRelated: ['courseOfferings']})
      .then(function(requirement) {
        resultList.push(requirement.toJSON());
        if (i === len - 1) {
          res.send(resultList);
          return resultList;
        }
      });
    });

  });
};

// get term queries and run them
// these queries return the 'term' objects with all related relations
exports.termQuery = function(req, res) {
  var queryObj = req.query;
  var queryModel = new Term(queryObj);

  queryModel.query({where: queryObj}).fetchAll()
  .then(function(results) {

    var resultList = [];
    var len = results.models.length;
    results.models.forEach(function(model, i) {
      model.fetch({withRelated: ['courseOfferings']})
      .then(function(term) {
        resultList.push(term.toJSON());
        if (i === len - 1) {
          res.send(resultList);
          return resultList;
        }
      });
    });

  });
};
