exports.up = function(knex) {
  return knex.schema.createTable('articles', articleTable => {
    articleTable.increments('article_id');
    articleTable.string('title').notNullable();
    articleTable.text('body').notNullable();
    articleTable.integer('votes').defaultTo(0);
    articleTable.string('topic').notNullable();
    articleTable.string('author').notNullable();
    articleTable
      .foreign('topic')
      .references('slug')
      .inTable('topics');
    articleTable
      .foreign('author')
      .references('username')
      .inTable('users');
    articleTable.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('articles');
};
