'use strict';

var crypto = require('crypto');
var pg = require('pg');
var pgConnString = require('pg-connection-string');
var pool = new pg.Pool(pgConnString.parse(process.env.DATABASE_URL));

module.exports = function(req, res, next) {
  var signature = req.headers['x-hub-signature'];
  var owner = req.body.repository.owner.login;
  var repository = req.body.repository.name;

  pool.connect(function(err, client, done) {
    if (err) {
      throw err;
    }
    client.query('SELECT id from repositories where provider=\'github\' AND name=$1 AND owner=$2', [repository, owner], function(err, results) {
      done();
      if (err) {
        throw err;
      }
      if (results.rows === 0) {
        res.send(200);
        next(false);
      } else {
        var row = results.rows[0];
        var secret = row.id;
        signature = signature.split('=');
        var method = signature[0];
        signature = signature[1];
        const hash = crypto.createHmac(method, secret)
                   .update(req._body)
                   .digest('hex');
        if(hash !== signature) {
          res.send(200);
          next(false);
        } else {
          next();
        }
      }
    });
  });

};
