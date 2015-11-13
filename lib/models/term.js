'use strict';

const Bookshelf = require('../settings/db');

const Term = Bookshelf.Model.extend({
  tableName: 'term'
});

module.exports = Bookshelf.model('Term', Term);
