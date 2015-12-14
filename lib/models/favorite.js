'use strict';

const Bookshelf = require('../settings/db');

require('./user');
require('./course');

const Favorite = Bookshelf.Model.extend({
    user: function() {
        return this.belongsTo('User');
    },
    course: function() {
        return this.belongsTo('Course');
    }
});

module.exports = Bookshelf.model('Favorite', Favorite);
