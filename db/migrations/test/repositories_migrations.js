module.exports = {
  up: function(knex, Promise) {
    return knex.schema.createTable('repositories', function (table) {
      table.uuid('id').primary();
      table.string('provider');
      table.string('name');
      table.string('owner');
    });
  },
  down: function(knex, Promise) {
    knex.schema.dropTable('repositories');
  }
};
