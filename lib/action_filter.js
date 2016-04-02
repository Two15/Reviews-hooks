'use strict';

module.exports = function(event, action) {
  var server = this;
  return new Promise(function(resolve, reject) {
    try {
      var mod = require(['.', event, action].join('/'));
      server.log.trace('Found handler for ' + event + '/' + action);
    } catch(e) {
      server.log.info(e.message);
      return reject('Could not find or open handler for ' + event + '/' + action);
    }
    resolve(mod);
  });
};
