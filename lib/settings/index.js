'use strict';

var common = module.exports = require('./common');


var extend = function(defaults, options) {
  var extended = {};
  var prop;
  for (prop in defaults) {
    if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
      extended[prop] = defaults[prop];
    }
  }
  for (prop in options) {
    if (Object.prototype.hasOwnProperty.call(options, prop)) {
      extended[prop] = options[prop];
    }
  }
  return extended;
};


if (process.env.NODE_ENV === 'PRODUCTION') {
  module.exports = extend(common, require('./production'));
} else {

  try {
    module.exports = extend(common, require('./local'));
  } catch (err) {}
}
