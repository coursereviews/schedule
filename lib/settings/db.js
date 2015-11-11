'use strict';

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './db/main.db',
  },
});

module.exports = knex;
