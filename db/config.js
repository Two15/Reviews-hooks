module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + '/migrations/test'
    },
    seeds: {
      directory: __dirname + '/seeds/test'
    },
    pool: { min: 1, max: 1 }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
