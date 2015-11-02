'use strict';

var envvar = require('envvar');

module.exports = {
  isProduction: true,
  host: envvar.string('HOST'),
  viewPath: 'public/',
  // staticRoot: '',
  // cssPath: 'styles/',
  // jsPath: 'js/',
};
