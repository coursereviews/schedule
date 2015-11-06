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
  
  var searchForValue = function(key, value){
    var resultArray = [];
    JSONData.catalog.forEach(function(item){
      if (item[key] === value) resultArray.push(item);
    });
    return resultArray;
  }
  
  // handle requests for the entire catalog
  router.get('/catalog', function(req, res) {
    res.send(JSONData);
  });
  
  //get course by code
  router.get('/catalog/code/:course_code', function(req, res) {
    var result = searchForValue('code', req.params.course_code);
    res.send(result);
  });
  
  //get course by department
  router.get('/catalog/dept/:department', function(req, res) {
    var result = searchForValue(req.params.department);
    res.send(result);
  });
  
  //get course by subject
  router.get('/catalog/subject/:subject', function(req, res) {
    var result = searchForValue('subject', req.params.subject);
    res.send(result);
  });
  
};