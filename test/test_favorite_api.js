'use strict';

const app = require('../lib/server').app;
const express = require('express');
const favoriteAPI = require('../lib/routes/favorite/favorite.controller');
const User = require('../lib/models/user');
const assert = require('assert');
// const request = require('supertest');
const mocha = require('mocha');
const child_process = require('child_process');
const exec = child_process.exec;
const execFile = child_process.execFile;
const spawn = child_process.spawn;
const termNo = '201590';


/*
 NOTE: This test should work with the current Fall 2015 catalog that gets scraped.
 It will not work with other data.
 Additionally, this test code only works if the favorite table is already empty.

*/


var runFavoriteTests = function(email) {
  return new Promise(function(resolve, reject) {
    var user;
    var usr = new User({
        email: email
      }).fetch()
      .then(function(usr) {
        user = usr;
        //console.log(user);
        return favoriteAPI.getAllFavoritesHelper(user);
      }).then(function(result) {
        assert.strictEqual(result.models.length, 0, "empty favorites DB not returning 0 results");
        return favoriteAPI.addFavoriteHelper(user, 1);
      }).then(function() {
        return favoriteAPI.getAllFavoritesHelper(user);
      }).then(function(result) {
        assert.strictEqual(result.models.length, 1, "adding course doesn't work");
        return favoriteAPI.removeFavoriteHelper(user, 1);
      }).then(function() {
        return favoriteAPI.getAllFavoritesHelper(user);
      }).then(function(result) {
        assert.strictEqual(result.models.length, 0, "removing course doesn't work");
        resolve(true);
      }).catch(function(err) {
        console.log(err);
        reject(Error(err));
      });
  });

}

// function clears database if it exists
var clearDB = function() {
  return new Promise(function (resolve, reject) {
    exec('rm db/schedule.db', function(err, stdout, stderr) {
      if (err){
        reject(err);
      }
      console.log(stdout);
      console.log('deleted');
      resolve(true);
    });
  }).catch(function(error) {
    console.log(error);
  });
};

var changePermissions = function() {
  return new Promise(function (resolve, reject) {
    exec('chmod 744 lib/scripts/scrape_catalog.js', function(err, stdout, stderr) {
      // idea for permission change from jansmolders86's reply to 'Running node (express)
      // on linux produces Error: spawn EACCES' hosted at:
      // http://stackoverflow.com/questions/19009778/ (cont.)
      // running-node-express-on-linux-produces-error-spawn-eacces

      if (err){
        reject(err);
      }
      resolve(true);
    });
  });
};

var makeMigrations = function() {
  return new Promise(function (resolve, reject) {
    exec('npm run migrate:latest', function(err, stdout, stderr) {
      // idea for permission change from jansmolders86's reply to 'Running node (express)
      // on linux produces Error: spawn EACCES' hosted at:
      // http://stackoverflow.com/questions/19009778/ (cont.)
      // running-node-express-on-linux-produces-error-spawn-eacces

      if (err){
        reject(err);
      }
      resolve(true);
    });
  });
};

var scrapeData = function() {
  return new Promise(function(resolve, reject) {
    var command = 'node lib/scripts/scrape_catalog.js '+ termNo;
    exec(command, function(e, stdout, stderr) {
      if (e){
        console.log(e);
        reject(e);
      }
      console.log('created');
      resolve(true);
    });
  });
}

// function populates db if it exists
var populateDB = function() {
  return new Promise(function (resolve, reject) {
    changePermissions()
    .then(function() {
      return makeMigrations();
    }).then(function() {
      return scrapeData();
    }).then(function(){
      resolve(true);
    }).catch(function(error) {
      reject(err);
    });
  });
};

clearDB()
.then(function(onFulfillment, onRejection) {
  return populateDB();
}).then(function(fulfill) {
  console.log('Success!');
}).catch(function(err) {
  console.log(err);
});
