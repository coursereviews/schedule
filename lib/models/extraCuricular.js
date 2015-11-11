/*
 * Schema:
 *  - title
 *  - start_time
 *  - end_time
 *  - days_of_week
 *
 */


'use strict';

const db = require('../settings/db');
const bookshelf = require('bookshelf')(db);


const ExtraCuricular = bookshelf.Model.extend({

});

module.exports = ExtraCuricular;
