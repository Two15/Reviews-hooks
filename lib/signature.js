'use strict';

var crypto = require('crypto');

module.exports = function(method, secret, body) {
  return crypto.createHmac(method, secret)
    .update(new Buffer(body)).digest('hex');
};
