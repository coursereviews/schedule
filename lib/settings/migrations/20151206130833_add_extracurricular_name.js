
exports.up = function(knex, Promise) {
  return knex.schema.table('extra_curricular', function(table) {
    table.string('name');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('extra_curricular', function(table) {
    table.dropColumn('name');
  });
};
