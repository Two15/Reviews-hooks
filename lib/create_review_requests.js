'use strict';

const denodeify = require('denodeify');
const client = require('./github');

module.exports = function(user, name, sha) {
  return function(reviewers) {
    // TODO Check status is "pending" first
    reviewers.forEach(function (reviewer) {
      denodeify(client.repos.createStatus)({
        user: user,
        repo: name,
        sha: sha,
        state: 'pending',
        description: 'Waiting the review from @' + reviewer,
        context: 'Review my code - @' + reviewer
      });
    });
    denodeify(client.repos.createStatus)({
      user: user,
      repo: name,
      sha: sha,
      state: 'success',
      description: 'Reviews have been required',
      context: 'Review my code'
    });
  };
};
