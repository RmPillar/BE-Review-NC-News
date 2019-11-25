exports.up = function(knex) {
  console.log('Creating User Table');
  return knex.schema.createTable('users', usersTable => {
    usersTable
      .string('username')
      .unique()
      .primary();
    usersTable.string('avatar_url').notNullable();
    usersTable.string('name').notNullable();
  });
};

exports.down = function(knex) {
  console.log('Dropping User Table');
  return knex.schema.dropTable('users');
};
