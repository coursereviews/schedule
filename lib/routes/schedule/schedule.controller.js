'use strict';

const path = require('path');
const fs = require('fs');

var catalogData = path.join(__dirname, '../../../data/201620_fullCatalog.json');
var scheduleData = path.join(__dirname, '../../../data/scheduleData');

// define JSON data in later function call
var JSONData;


// get catalog data
var getCatalogJSON = function() {
  JSONData = JSON.parse(fs.readFileSync(catalogData));
};
getCatalogJSON();


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


exports.getAllSchedules = function(req, res) {

};


exports.getSchedule = function(req, res) {
  
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
