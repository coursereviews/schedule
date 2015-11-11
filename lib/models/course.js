'use strict';

const db = require('../settings/db');
const bookshelf = require('bookshelf')(db);


const Course = bookshelf.Model.extend({

});



module.exports = Course;
