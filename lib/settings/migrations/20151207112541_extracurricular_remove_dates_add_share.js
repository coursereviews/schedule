
exports.up = function(knex, Promise) {
  return knex.schema.table('extra_curricular', function(table) {
    table.dropColumn('start_date');
    table.dropColumn('end_date');
    table.boolean('shareable');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('extra_curricular', function(table) {
    table.string('start_date');
    table.string('end_date');
    table.dropColumn('shareable');
  });
};
