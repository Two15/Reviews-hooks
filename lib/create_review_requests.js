'use strict';

const denodeify = require('denodeify');
const client = require('./github').client();

module.exports = function(user, name, sha) {
  return function(reviewers) {
    // TODO Check status is "pending" first
    const promises = reviewers.map(function (reviewer) {
      return denodeify(client.repos.createStatus)({
        user: user,
        repo: name,
        sha: sha,
        state: 'pending',
        description: 'Waiting the review from @' + reviewer,
        context: 'Review my code - @' + reviewer
      });
    });
    return Promise.all(promises).then(function() {
      return denodeify(client.repos.createStatus)({
        user: user,
        repo: name,
        sha: sha,
        state: 'success',
        description: 'Reviews have been required',
        context: 'Review my code'
      });
    });
  };
};
