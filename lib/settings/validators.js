'use strict';

const moment = require('moment');

const timeFormat = 'hh:mma';

module.exports = {
  /* Custom validator to check that the value is a time of the format hh:mma.
   */
  isTime: function(value) {
    return moment(value, timeFormat).isValid();
  },

  /* Custom validator to check that value occurs after beforeTime.
   * Both value and beforeTime are strings of the form hh:mma.
   */
  isAfter: function(value, beforeTime) {
    return moment(value, timeFormat).isAfter(moment(beforeTime, timeFormat));
  }
};
