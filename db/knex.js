var environment = process.env.NODE_ENV || 'development';
var config = require('./config.js')[environment];

module.exports = require('knex')(config);
