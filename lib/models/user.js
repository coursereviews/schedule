/* global -Promise */

'use strict';

const Bookshelf = require('../settings/db');
require('./schedule');
require('./course');

//todo:delete this?
//require('./favorite');

const User = Bookshelf.Model.extend({
  tableName: 'schedule_user',

  hasTimestamps: true,

  hidden: ['created_at', 'updated_at'],

  schedules: function() {
    return this.hasMany('Schedule');
  },

  extraCurriculars: function() {
    return this.hasMany('ExtraCurricular');
  },
  favorites: function(){
    //Todo: how about the junction table favourite? Why not include it?
    return this.belongsToMany('Course','favorite'); //.through('Favorite');;
  }
});

module.exports = Bookshelf.model('User', User);
