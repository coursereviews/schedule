
exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorite', function(table) {
    table.integer('course_id')
      .references('id')
      .inTable('course')
      .onDelete('CASCADE');
    table.integer('schedule_user_id')
      .references('id')
      .inTable('schedule_user')
      .onDelete('CASCADE')
      .index();

    table.primary(['course_id', 'schedule_user_id']);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorite');
};
