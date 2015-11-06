'use strict';

const Sequelize = require('sequelize');

const settings = require('./settings');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },

  storage: './db/main.db',
});


let db = {};

// we will eventually initialize the DB here and include the rest of the models

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
