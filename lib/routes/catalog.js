'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');

var catalogData = path.join(__dirname, '../../data/201620_fullCatalog.json');

//define JSON data in later function call
var JSONData;

module.exports = function(router){
  
  //get catalog data
  var getCatalogJSON = function(){
    JSONData = JSON.parse(fs.readFileSync(catalogData));
  }
  getCatalogJSON();
  
  //search through single-word (or few-word) string fields of catalog objects
  var searchForValueSingleStringField = function(key, value){
    var resultArray = [];
    JSONData.catalog.forEach(function(item){
      if (item[key] === value) resultArray.push(item);
    });
    return resultArray;
  }
  
  //search through array fields of catalog objects
  var searchForValueStringArrayField = function(key, value){
    var resultArray = [];
    JSONData.catalog.forEach(function(item){
      item[key].forEach(function(requirement){
        if (requirement === value) resultArray.push(item);
      });
    });
    return resultArray;
  }
  
  //do a query AND search--each query param must be contained in catalog object
  var querySearch = function(queryObj){
    var resultArray = [];
    var queryKeys = Object.keys(queryObj);
    var curValue, addToResults;
    JSONData.catalog.forEach(function(item){
      addToResults = true;
      queryKeys.forEach(function(key){
        //for each item in catalog, assume it will be added
        //to results until shown otherwise
        
        curValue = item[key];
        
        if (curValue === undefined){
          addToResults = false;
          return;
        }
        
        if (Array.isArray(curValue)){
          //check to see if value is in an array
          var contained = false;
          
          curValue.forEach(function(elmnt){
            if (elmnt === queryObj[key]) contained = true;
          });
          
          if (!contained) addToResults = false;
          
        } else if (curValue.search(queryObj[key]) === -1){
          //assuming string field
          addToResults = false;
        }
      });
      
      if (addToResults) resultArray.push(item);
    
    })
    
    return resultArray;
  }
  
  // handle requests for the entire catalog
  router.get('/catalog', function(req, res) {
    res.send(JSONData);
  });
  
  //get courses by level
  router.get('/catalog/level/:level', function(req, res) {
    var result = searchForValueSingleStringField('level', req.params.level);
    res.send(result);
  });
  
  //get courses by subject
  router.get('/catalog/subject/:subject', function(req, res) {
    var result = searchForValueSingleStringField('subject', req.params.subject);
    res.send(result);
  });
  
  //get courses by href
  router.get('/catalog/href/:href', function(req, res) {
    var result = searchForValueSingleStringField('href', req.params.href);
    res.send(result);
  });
  
  //get courses by code
  router.get('/catalog/code/:course_code', function(req, res) {
    var result = searchForValueSingleStringField('code', req.params.course_code);
    res.send(result);
  });
  
  //get courses by description
  
  //get courses by title
  
  //get courses by alternate
  //NOTE: not entirely sure what to expect as a value, 
  //because they all have a value of "None" in the sample data
  router.get('/catalog/alternate/:alternate', function(req, res) {
    var result = searchForValueSingleStringField(req.params.alternate);
    res.send(result);
  });
  
  //get courses by type
  router.get('/catalog/type/:type', function(req, res) {
    var result = searchForValueSingleStringField(req.params.type);
    res.send(result);
  });
  
  //get courses by term
  router.get('/catalog/term/:term', function(req, res) {
    var result = searchForValueSingleStringField(req.params.term);
    res.send(result);
  });
  
  //get courses by department
  router.get('/catalog/dept/:department', function(req, res) {
    var result = searchForValueSingleStringField(req.params.department);
    res.send(result);
  });
  
  //get courses by single requirement
  router.get('/catalog/requirements/:requirement', function(req, res) {
    var result = searchForValueStringArrayField(req.params.requirement);
    res.send(result);
  });
  
  //get courses by instructor
  router.get('/catalog/instructor/:instructor', function(req, res) {
    var result = searchForValueStringArrayField(req.params.instructor);
    res.send(result);
  });
  
  //get courses by location
  router.get('/catalog/location/:location', function(req, res) {
    var result = searchForValueSingleStringField(req.params.location);
    res.send(result);
  });
  
  //get courses by schedule
  /*
  * PLACEHOLDER--pending desired functionality
  */
  
  //get courses by CRN
  router.get('/catalog/crn/:crn', function(req, res) {
    var result = searchForValueSingleStringField(req.params.crn);
    res.send(result);
  });
  
  //get queries and run them
  router.get('/catalog/query', function(req, res) {
    var queryObj = req.query;
    var result = querySearch(queryObj);
    res.send(result);
  });
  
};