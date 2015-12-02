'use strict';

const Bookshelf = require('../settings/db');

require('./user');
require('./course');

//TODO: noise that is irrelevant? Probably
const Favorite = Bookshelf.Model.extend({
    user: function(){
        return this.belongsTo('User');
    },
    course: function(){
        return this.belongsTo('Course');
    }
});

module.exports = Bookshelf.model('Favorite', Favorite);