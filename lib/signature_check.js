'use strict';

var knex = require('../db/knex');
const signMessage = require('./signature');

module.exports = function(req, res, next) {
  var signature = req.headers['x-hub-signature'];
  var owner = req.body.repository.owner.login;
  var repository = req.body.repository.name;

  module.exports.repositoryUUID(owner, repository)
  .then(function(secret) {
    signature = signature.split('=');
    var method = signature[0];
    signature = signature[1];
    const hash = signMessage(method, secret, req._body);
    if (hash !== signature) {
      throw new Error(`Invalid signature for repository ${owner}/${repository}`);
    }
  })
  .then(()=> next())
  .catch(function(err) {
    console.error(err.message);
    next(false);
    res.send(200);
  });
};

module.exports.repositoryUUID = function(owner, name) {
  return knex('repositories')
  .where({
    provider: 'github',
    name: name,
    owner: owner
  })
  .select('id')
  .then(function(rows) {
    if (!rows.length) {
      throw new Error(`No column was found for repository ${owner}/${name}`);
    }
    if (rows.length > 1) {
      throw new Error(`Multiple columns for repository ${owner}/${name}`);
    }
    return rows[0];
  })
  .then(function(row) {
    return row.id;
  });
};
