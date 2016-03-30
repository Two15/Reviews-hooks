'use strict';

const validEvents = ['pull_request', 'issue_comment'];

module.exports = function(event) {
  return new Promise(function(resolve, reject) {
    if (validEvents.indexOf(event) !== -1) {
      resolve(event);
    } else {
      reject('unknown event ' + event);
    }
  });
};
