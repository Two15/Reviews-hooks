'use strict';

const client = require('./github').client();
const denodeify = require('denodeify');
const uniq = require('lodash/uniq');

module.exports = function(author, body, repo, name, sha) {
  return function(reviewers) {
    reviewers = uniq(reviewers);
    if (body.trim() === ':-1:' && reviewers.indexOf(author) !== -1) {
      return denodeify(client.repos.createStatus)({
        user: repo,
        repo: name,
        sha: sha,
        state: 'failure',
        description: '@' + author + ' rejected the pull-request',
        context: 'Review my code - @' + author
      });
    }
    if (body.trim() === ':+1:' && reviewers.indexOf(author) !== -1) {
      return denodeify(client.repos.createStatus)({
        user: repo,
        repo: name,
        sha: sha,
        state: 'success',
        description: '@' + author + ' accepted the pull-request',
        context: 'Review my code - @' + author
      });
    }
    return reviewers;
  };
};
