'use strict';

const denodeify = require('denodeify');
const client = require('./github').client();

module.exports = function(user, name, sha) {
  let hasReviewPromise;
  return function(reviewStatuses) {
    const reviewers = Object.keys(reviewStatuses);
    const promises = reviewers.map(function (reviewer) {
      return denodeify(client.repos.createStatus)({
        user: user,
        repo: name,
        sha: sha,
        state: reviewStatuses[reviewer].state,
        description: reviewStatuses[reviewer].description,
        context: reviewStatuses[reviewer].context
      });
    });
    if (reviewers.length) {
      hasReviewPromise = denodeify(client.repos.createStatus)({
        user: user,
        repo: name,
        sha: sha,
        state: 'success',
        description: 'Reviews have been required',
        context: 'Review my code'
      });
    } else {
      hasReviewPromise = denodeify(client.repos.createStatus)({
        user: user,
        repo: name,
        sha: sha,
        state: 'failure',
        description: 'You did not require code review',
        context: 'Review my code'
      });
    }
    return Promise.all(promises.concat(hasReviewPromise));
  };
};
