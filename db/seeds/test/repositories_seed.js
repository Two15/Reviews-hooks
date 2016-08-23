var uuid = require('node-uuid').v4;

exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('repositories').del(),

    // Inserts seed entries
    knex('repositories').insert({
      id: uuid(),
      provider: 'github',
      owner: 'Two15',
      name: 'trashbin'
    })
  );
};
