
exports.up = function(knex, Promise) {
  return knex.schema.createTable('schedule_user', function(table) {
    // Table name is "schedule_user" instead of "user" since "user" is a
    // reserved word in PostgreSQL.
    table.increments('id').primary();
    table.string('username');
    table.string('email');
    table.string('password');
    table.timestamps();     // adds created_at and updated_at
  })
  .createTable('course', function(table) {
    table.increments('id').primary();
    table.text('description');
    table.string('title');
    table.string('type');   // the type of course, e.x. Lecture,
    table.string('code');   // not specific to term, e.x. CSCI0101
    table.integer('department_id').references('id').inTable('department');
  })
  .createTable('professor', function(table) {
    table.increments('id').primary();
    table.string('name');
    table.string('email');
    table.string('midd_id');
  })
  .createTable('requirement', function(table) {
    // A distribution requirement that a course fulfills
    table.increments('id').primary();
    table.string('code');
    table.string('name');
  })
  .createTable('department', function(table) {
    table.increments('id').primary();
    table.string('code');
    table.string('name');
  })
  .createTable('term', function(table) {
    table.increments('id').primary();
    table.string('code');
  })
  .createTable('course_offering', function(table) {
    table.increments('id').primary();
    table.integer('course_id').references('id').inTable('course');
    table.integer('term_id').references('id').inTable('term').index();

    table.string('href');         // link to the Middlebury catalog
    table.string('course_code');  // the term-specific course code
    table.string('crn');          // course registration number
  })
  .createTable('meeting', function(table) {
    // A meeting is a date, time, and location
    table.increments('id').primary();
    table.integer('course_offering_id').references('id').inTable('course_offering').index();

    // Date and Time
    table.string('start_time');
    table.string('end_time');
    table.string('start_date');
    table.string('end_date');
    table.string('days');       // a comma separated list of days of the week

    // Location
    table.string('building');
    table.string('room');
  })
  .createTable('schedule', function(table) {
    table.increments('id').primary();
    table.integer('schedule_user_id').references('id').inTable('schedule_user').index();
    table.integer('term_id').references('id').inTable('term');

    table.string('share_url');
    table.string('name');
    table.timestamps();       // adds created_at and updated_at
  })
  .createTable('extra_curricular', function(table) {
    table.increments('id').primary();
    table.integer('schedule_user_id').references('id').inTable('schedule_user').index();

    table.string('start_time');
    table.string('end_time');
    table.string('start_date');
    table.string('end_date');
    table.string('days');     // a comma separated list of days of the week
  })

  /*
   * Junction tables
   */
  .createTable('course_offering_professor', function(table) {
    // A course offering has many professors.
    // A professor has many course offerings.
    table.integer('course_offering_id').references('id').inTable('course_offering');
    table.integer('professor_id').references('id').inTable('professor');

    table.primary(['course_offering_id', 'professor_id']);
  })
  .createTable('course_offering_requirement', function(table) {
    // A course offering has many requirements.
    // A requirement has many course offerings.
    table.integer('course_offering_id').references('id').inTable('course_offering');
    table.integer('requirement_id').references('id').inTable('requirement');

    table.primary(['course_offering_id', 'requirement_id']);
  })
  .createTable('course_offering_schedule', function(table) {
    // A schedule has many course offerings.
    // A course offering has many schedules.
    table.integer('schedule_id').references('id').inTable('schedule');
    table.integer('course_offering_id').references('id').inTable('course_offering');

    table.primary(['schedule_id', 'course_offering_id']);
  })
  .createTable('schedule_extra_curricular', function(table) {
    // A schedule has many extra-curriculars.
    // An extra-curricular has one or more schedules.
    table.integer('schedule_id').references('id').inTable('schedule');
    table.integer('extra_curricular_id').references('id').inTable('extra_curricular');

    table.primary(['schedule_id', 'extra_curricular_id']);
  });
};

exports.down = function(knex, Promise) {

};
