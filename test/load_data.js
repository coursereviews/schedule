'use strict';

// const request = require('supertest');
const mocha = require('mocha');
const child_process = require('child_process');
const exec = child_process.exec;
const spawn = child_process.spawn;
const termNo = '201590';
const fs = require('fs');

// function clears database if it exists
var clearDB = function() {
  return new Promise(function (resolve, reject) {
    fs.stat('db/schedule.db', function (err, stats) {
      if (err) {
        // if schedule.db doesn't exist
        resolve(true);
      } else {
        exec('rm db/schedule.db', function(err, stdout, stderr) {
          if (err) {
            reject(err);
          }
          console.log('DB removed');
          resolve(true);
        });
      }
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

      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};

var makeMigrations = function() {
  return new Promise(function (resolve, reject) {
    exec('npm run migrate:latest', function(err, stdout, stderr) {
      if (err) {
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
      if (e) {
        console.log(e);
        reject(e);
      }
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
    }).then(function() {
      resolve(true);
    }).catch(function(error) {
      reject(err);
    });
  });
};

function main() {
  return new Promise(function(resolve, reject) {
    clearDB()
    .then(function(onFulfillment, onRejection) {
      return populateDB();
    }).then(function(fulfill) {
      console.log('DB population complete');
      resolve(true);
    }).catch(function(err) {
      console.log(err);
      reject(err);
    });
  });
}

exports.main = main;
