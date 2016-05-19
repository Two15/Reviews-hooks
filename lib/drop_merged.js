'use strict';

module.exports = function (pull) {
  var merged = pull.merged;
  if (!merged) {
    return Promise.resolve(pull);
  }
  return Promise.reject(new Error('Dropping closed Pull request: ' + pull.url));

};
