'use strict';

module.exports = function(event, action) {
  return new Promise(function(resolve, reject) {
    try {
      var mod = require(['.', event, action].join('/'));
      console.log('Found handler for ' + event + '/' + action);
    } catch(e) {
      console.log(e.message);
      return reject('Handler not found for ' + event + '/' + action);
    }
    resolve(mod);
  });
};
