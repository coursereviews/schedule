'use strict';

const Bookshelf = require('../settings/db');
require('./user');
require('./schedule');

const ExtraCurricular = Bookshelf.Model.extend({
  tableName: 'extra_curricular',

  user: function () {
    return this.belongsTo('User');
  },

  schedules: function () {
    return this.belongsToMany('Schedule', 'schedule_extra_curricular');
  }
});

module.exports = Bookshelf.model('ExtraCurricular', ExtraCurricular);
