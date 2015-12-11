/*
const assert = require('assert');
const http = require('http');
const queryAPI = require('../lib/routes/catalog/catalog.controller');

var result;
var request

// NEEDS FIXING--bug is async related, perhaps?
var result = queryAPI.courseQuery({query: {department_id: "6"}}, {}).
then(function(arr){
  return arr.length;
});
assert.strictEqual(result, 7, "department_id search not working for courses");
*/
