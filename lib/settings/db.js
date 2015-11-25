'use strict';

// configure knex
const knex = require('knex')(require('./knexfile'));

const Bookshelf = require('bookshelf')(knex);

// https://github.com/tgriesser/bookshelf/wiki/Plugin:-Model-Registry
Bookshelf.plugin('registry');

// https://github.com/tgriesser/bookshelf/wiki/Plugin:-Visibility
Bookshelf.plugin('visibility');

module.exports = Bookshelf;
