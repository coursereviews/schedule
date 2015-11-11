'use strict';

const db = require('../settings/db');
const bookshelf = require('bookshelf')(db);


const User = bookshelf.Model.extend({

});

module.exports = User;
