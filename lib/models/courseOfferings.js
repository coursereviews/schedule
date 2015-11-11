'use strict';

const db = require('../settings/db');
const bookshelf = require('bookshelf')(db);


const CourseOfferrings = bookshelf.Model.extend({

});

module.exports = CourseOfferrings;
