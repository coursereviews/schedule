'use strict';

const path = require('path');
const fs = require('fs');
const Course = require('../../models/course.js');
const CourseOffering = require('../../models/courseoffering.js');
const Department = require('../../models/department.js');
const ExtraCurricular = require('../../models/extracurricular.js');
const Meeting = require('../../models/meeting.js');
const Professor = require('../../models/professor.js');
const Requirement = require('../../models/requirement.js');
const Term = require('../../models/term.js');

var catalogData = path.join(__dirname, '../../../data/201620_fullCatalog.json');
var scheduleData = path.join(__dirname, '../../../data/scheduleData');

// define JSON data in later function call
var JSONData;


// get catalog data
var getCatalogJSON = function() {
  JSONData = JSON.parse(fs.readFileSync(catalogData));
};
getCatalogJSON();

// search through single-word (or few-word) string fields of catalog objects
var searchForValueSingleStringField = function(key, value) {
  value = value.toLowerCase();
  var resultArray = [];
  JSONData.catalog.forEach(function(item) {
    if (item[key].toLowerCase().search(value) > -1) {
      resultArray.push(item);
    }
  });
  return resultArray;
};

// search through array fields of catalog objects
var searchForValueStringArrayField = function(key, value) {
  value = value.toLowerCase();
  var resultArray = [];
  JSONData.catalog.forEach(function(item) {
    item[key].forEach(function(requirement) {
      if (requirement.toLowerCase() === value) {
        resultArray.push(item);
      }
    });
  });
  return resultArray;
};

// do a query AND search-each query param must be contained in catalog object
var querySearch = function(queryObj) {
  var resultArray = [];
  var queryKeys = Object.keys(queryObj);
  var curValue, addToResults;
  JSONData.catalog.forEach(function(item) {
    addToResults = true;
    queryKeys.forEach(function(key) {
      // for each item in catalog, assume it will be added
      // to results until shown otherwise

      curValue = item[key];

      if (curValue === undefined) {
        addToResults = false;
        return;
      }

      if (Array.isArray(curValue)) {
        // check to see if value is in an array
        var contained = false;

        curValue.forEach(function(elmnt) {
          elmnt = elmnt.toLowerCase();
          if (elmnt === queryObj[key].toLowerCase()) {
            contained = true;
          }
        });

        if (!contained) {
          addToResults = false;
        }

      } else if (curValue.toLowerCase().search(queryObj[key].toLowerCase()) === -1) {
        // assuming string field
        addToResults = false;
      }
    });

    if (addToResults) {
      resultArray.push(item);
    }
  });

  return resultArray;
};

// handle requests for the entire catalog
exports.index = function(req, res) {
  res.send(JSONData);
};


// get courses by level
exports.level = function(req, res) {
  var result = searchForValueSingleStringField('level', req.params.level);
  res.send(result);
};

// get courses by subject
exports.subject = function(req, res) {
  var result = searchForValueSingleStringField('subject', req.params.subject);
  res.send(result);
};

// get courses by href
exports.href = function(req, res) {
  var result = searchForValueSingleStringField('href', req.params.href);
  res.send(result);
};

// get courses by code
exports.code = function(req, res) {
  var result = searchForValueSingleStringField('code', req.params.course_code);
  res.send(result);
};

// get courses by description

// get courses by title

// get courses by alternate
// NOTE: not entirely sure what to expect as a value,
// because they all have a value of 'None' in the sample data
exports.alternate = function(req, res) {
  var result = searchForValueSingleStringField('alternate', req.params.alternate);
  res.send(result);
};

// get courses by type
exports.type = function(req, res) {
  var result = searchForValueSingleStringField('type', req.params.type);
  res.send(result);
};

// get courses by term
exports.term = function(req, res) {
  var result = searchForValueSingleStringField('term', req.params.term);
  res.send(result);
};

// get courses by department
exports.department = function(req, res) {
  var result = searchForValueSingleStringField('department', req.params.department);
  res.send(result);
};

// get courses by single requirement
exports.requirements = function(req, res) {
  var result = searchForValueStringArrayField('requirements', req.params.requirement);
  res.send(result);
};

// get courses by instructor
exports.instructor = function(req, res) {
  // replace underscores with spaces
  var instr = req.params.instructor.replace(/_/g, ' ');
  var result = searchForValueStringArrayField('instructor', instr);
  res.send(result);
};

// get courses by location
exports.location = function(req, res) {
  // replace underscores with spaces
  var loc = req.params.location.replace(/_/g, ' ');
  var result = searchForValueSingleStringField('location', loc);
  res.send(result);
};

// get courses by schedule
/*
 * PLACEHOLDER--pending desired functionality
 */

// get courses by CRN
exports.crn = function(req, res) {
  var result = searchForValueSingleStringField('CRN', req.params.crn);
  res.send(result);
};


// get course queries and run them
// these queries return the 'course' objects with all related relations
exports.courseQuery = function(req, res) {
  var queryObj = req.query;

  // replace all underscores with spaces
  Object.keys(queryObj).forEach(function(key) {
    //Thanks to Tony for the check for strings vs. arrays

    if (typeof queryObj[key] == 'string') {
      //if value isn't an array
      queryObj[key] = queryObj[key].replace(/_/g, ' ');
    } else {
      //if value is an array
      queryObj[key].forEach(function(item){
        item = item.replace(/_/g, ' ');
      });
    }
  });

  var queryModel = new Course(queryObj);

  queryModel.query({where: queryObj}).fetchAll()
  .then(function(results){

    var resultList = [];
    var len = results.models.length;
    results.models.forEach(function(model, i){
      model.fetch({withRelated: ['department', 'courseOfferings']})
      .then(function(course){
        resultList.push(course.toJSON());
        if (i === len-1){
          res.send(resultList);
          console.log(resultList);
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
  .then(function(results){

    var resultList = [];
    var len = results.models.length;
    results.models.forEach(function(model, i){
      model.fetch({withRelated: ['course', 'term', 'professors', 'schedules', 'requirements', 'meetings']})
      .then(function(cOff){
        resultList.push(cOff.toJSON());
        if (i === len-1){
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
    //Thanks to Tony for the check for strings vs. arrays

    if (typeof queryObj[key] == 'string') {
      //if value isn't an array
      queryObj[key] = queryObj[key].replace(/_/g, ' ');
    } else {
      //if value is an array
      queryObj[key].forEach(function(item){
        item = item.replace(/_/g, ' ');
      });
    }
  });

  var queryModel = new Department(queryObj);

  queryModel.query({where: queryObj}).fetchAll()
  .then(function(results){

    var resultList = [];
    var len = results.models.length;
    results.models.forEach(function(model, i){
      model.fetch({withRelated: ['courses']})
      .then(function(dept){
        resultList.push(dept.toJSON());
        if (i === len-1){
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
    //Thanks to Tony for the check for strings vs. arrays

    if (typeof queryObj[key] == 'string') {
      //if value isn't an array
      queryObj[key] = queryObj[key].replace(/_/g, ' ');
    } else {
      //if value is an array
      queryObj[key].forEach(function(item){
        item = item.replace(/_/g, ' ');
      });
    }
  });

  var queryModel = new ExtraCurricular(queryObj);

  queryModel.query({where: queryObj}).fetchAll()
  .then(function(results){

    var resultList = [];
    var len = results.models.length;
    results.models.forEach(function(model, i){
      model.fetch({withRelated: ['user', 'schedules']})
      .then(function(exCur){
        resultList.push(exCur.toJSON());
        if (i === len-1){
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
  console.log(req.query);

  // replace all underscores with spaces
  Object.keys(queryObj).forEach(function(key) {
    //Thanks to Tony for the check for strings vs. arrays

    if (typeof queryObj[key] == 'string') {
      //if value isn't an array
      queryObj[key] = queryObj[key].replace(/_/g, ' ');
    } else {
      //if value is an array
      queryObj[key].forEach(function(item){
        item = item.replace(/_/g, ' ');
      });
    }
  });

  var queryModel = new Meeting(queryObj);
  //--------------------
  //NEEDS FIXING!
  queryModel.query({where: queryObj}).fetchAll()
  .then(function(results){

    var resultList = [];
    var len = results.models.length;
    results.models.forEach(function(model, i){
      model.fetch({withRelated: ['courseOffering', 'days']})
      .then(function(mtng){
        resultList.push(mtng.toJSON());
        if (i === len-1){
          res.send(resultList);
          return resultList;
        }
      });
    });

  });
  //--------------------
};

// get professor queries and run them
// these queries return the 'professor' objects with all related relations
exports.professorQuery = function(req, res) {
  var queryObj = req.query;

  // replace all underscores with spaces
  Object.keys(queryObj).forEach(function(key) {
    //Thanks to Tony for the check for strings vs. arrays

    if (typeof queryObj[key] == 'string') {
      //if value isn't an array
      queryObj[key] = queryObj[key].replace(/_/g, ' ');
    } else {
      //if value is an array
      queryObj[key].forEach(function(item){
        item = item.replace(/_/g, ' ');
      });
    }
  });

  var queryModel = new Professor(queryObj);

  queryModel.query({where: queryObj}).fetchAll()
  .then(function(results){

    var resultList = [];
    var len = results.models.length;
    results.models.forEach(function(model, i){
      model.fetch({withRelated: ['courseOfferings']})
      .then(function(prof){
        resultList.push(prof.toJSON());
        if (i === len-1){
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
  .then(function(results){

    var resultList = [];
    var len = results.models.length;
    results.models.forEach(function(model, i){
      model.fetch({withRelated: ['courseOfferings']})
      .then(function(requirement){
        resultList.push(requirement.toJSON());
        if (i === len-1){
          res.send(resultList); //resultList
          return resultList; //resultList
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
  .then(function(results){

    var resultList = [];
    var len = results.models.length;
    results.models.forEach(function(model, i){
      model.fetch({withRelated: ['courseOfferings']})
      .then(function(term){
        resultList.push(term.toJSON());
        if (i === len-1){
          res.send(resultList);
          return resultList;
        }
      });
    });

  });
};

// get queries and run them
// these queries return the 'course' objects with all related relations
exports.query = function(req, res) {
  var queryObj = req.query;
  var course_list;

  // replace all underscores with spaces
  Object.keys(queryObj).forEach(function(key) {
    //Thanks to Tony for the check for strings vs. arrays

    if (typeof queryObj[key] == 'string') {
      //if value isn't an array
      queryObj[key] = queryObj[key].replace(/_/g, ' ');
    } else {
      //if value is an array
      queryObj[key].forEach(function(item){
        item = item.replace(/_/g, ' ');
      });
    }
  });

  var searchProfessor  = new Professor()
  .query({where: {id: 7}})
  .fetch({withRelated: ['courseOfferings']})
  .then(function(details) {
    course_list = JSON.stringify(details);
    res.send(course_list);
  });
//   //res.send(queryObj);
//   var queryModel = new Course(queryObj);
//
//   queryModel.query({where: queryObj}).fetchAll()
//   .then(function(results){
//     console.log(results);
//     var resultList = [];
//     var len = results.models.length;
//     results.models.forEach(function(model, i){
//       model.fetch({withRelated: ['department', 'courseOfferings']})
//       .then(function(course){
//         resultList.push(course.toJSON());
//         if (i === len-1){
//           res.send(resultList);
//         }
//       });
//     });
//
//   });
 };

var constants = {
  USER_ID: 'userID',
  CRN_ARRAY: 'courseArray',

  SCHEDULE: 'schedule',
  SCHEDULE_ID: 'scheduleID',
};

var getScheduleJSON = function() {
  var scheduleJSON = JSON.parse(fs.readFileSync(scheduleData));
  return scheduleJSON;
};
var writeToScheduleJSON = function(content) {
  fs.writeFileSync(scheduleData, JSON.stringify(content));
};
var createSchedule = function(userID, crnArray, id) {
  var newSchedule = {};
  newSchedule[constants.USER_ID] = userID;
  newSchedule[constants.CRN_ARRAY] = crnArray;

  // some singleton class that generates an id???
  newSchedule[constants.SCHEDULE_ID] = id;
  // return a json file
  return newSchedule;
};


// create schedule
exports.createSchedule = function(req, res) {
  var results = getSchedulesByValue(constants.SCHEDULE_ID,
    req.body[constants.SCHEDULE_ID]);

  // avoiding duplicate create
  if (results.length > 0) {
    res.send('Opps, looks like theres already a record there');
    return;
  }
  var newSchedule = createSchedule(req.body[constants.USER_ID],
    req.body[constants.CRN_ARRAY],
    req.body[constants.SCHEDULE_ID]);
  var scheduleJSON = getScheduleJSON();
  scheduleJSON[constants.SCHEDULE].push(newSchedule);
  writeToScheduleJSON(scheduleJSON);

  res.send(scheduleJSON);
};

// update schedule based on schedule id
exports.updateSchedule = function(req, res) {
  var sID = req.body[constants.SCHEDULE_ID];
  // assuming ids are unique
  var scheduleJSON = getScheduleJSON();
  scheduleJSON[constants.SCHEDULE].forEach(function(item) {
    if (item[constants.SCHEDULE_ID] === sID) {
      var fields = req.body;
      for (var i in fields) {
        item[i] = fields[i];
      }
    }
  });
  res.send(scheduleJSON);
};

// delete base on the id
exports.deleteSchedule = function(req, res) {
  var sID = req.body[constants.SCHEDULE_ID];
  // assuming ids are unique
  var scheduleJSON = getScheduleJSON();
  for (var i = 0; i < scheduleJSON[constants.SCHEDULE].length; i += 1) {
    if (scheduleJSON[constants.SCHEDULE][i][constants.SCHEDULE_ID] === sID) {
      scheduleJSON[constants.SCHEDULE].splice(i, 1);
    }
  }
  res.send(scheduleJSON);
};

var getSchedulesByValue = function(key, value) {
  var scheduleJSON = getScheduleJSON();
  var resultArray = [];
  scheduleJSON[constants.SCHEDULE].forEach(function(item) {
    if (item[key] === value) {
      resultArray.push(item);
    }
  });
  return resultArray;
};
