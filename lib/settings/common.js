'use strict';

const path = require('path');
const Sequelize = require('sequelize');

const appRoot = path.normalize(__dirname + '/../../');
const staticRoot = '/';
const staticPath = path.join(appRoot, 'public');

// const faviconPath = path.join(staticPath, 'favicon.ico');

module.exports = {
  host: 'http://127.0.0.1:8000/',
  port: 8000,
  root: appRoot,
  staticRoot: staticRoot,
  staticPath: staticPath,
  // viewPath: 'lib/views',
  // cssPath: 'styles/css/',
  // filePath: 'files/',
  // faviconPath: faviconPath,
};
