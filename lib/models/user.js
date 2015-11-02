const sequelize = require('sequelize');

var User = sequelize.define('user', {
  username: {
    type: sequelize.STRING,
    field: 'username',
  }
  firstName: {
    type: sequelize.STRING,
    field: 'first_name',
  },
  lastName: {
    type: sequelize.STRING,
  },
}, {
  freezeTableName: true,
});

module.exports = User;
