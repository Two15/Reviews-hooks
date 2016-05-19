'use strict';

const denodeify = require('denodeify');
const client = require('./github').client();

module.exports = function(user, name, sha) {
  return function(reviewStatuses) {
    // TODO Check status is "pending" first
    const reviewers = Object.keys(reviewStatuses);
    reviewers.forEach(function (reviewer) {
      denodeify(client.repos.createStatus)({
        user: user,
        repo: name,
        sha: sha,
        state: reviewStatuses[reviewer],
        description: 'Waiting the review from @' + reviewer,
        context: 'Review my code - @' + reviewer
      });
    });
    if (reviewers.length) {
      denodeify(client.repos.createStatus)({
        user: user,
        repo: name,
        sha: sha,
        state: 'success',
        description: 'Reviews have been required',
        context: 'Review my code'
      });
    } else {
      denodeify(client.repos.createStatus)({
        user: user,
        repo: name,
        sha: sha,
        state: 'failure',
        description: 'You did not require code review',
        context: 'Review my code'
      });
    }
  };
};
