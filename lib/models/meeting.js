'use strict';

const Bookshelf = require('../settings/db');
require('./courseoffering');

const Meeting = Bookshelf.Model.extend({
  tableName: 'meeting',

  courseOffering: function() {
    return this.belongsTo('CourseOffering');
  },

  days: function() {
    return this.get('days').split(',');
  }
});

module.exports = Bookshelf.model('Meeting', Meeting);
