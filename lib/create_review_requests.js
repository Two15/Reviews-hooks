'use strict';

const denodeify = require('denodeify');
const GithubApi = require('github4');

const client = new GithubApi({
  version: '3.0.0',
  timeout: 5000,
  headers: 'MyPeopleDoc Deploy Agent'
});

client.authenticate({
  type: 'oauth',
  token: process.env.GITHUB_TOKEN
});

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
