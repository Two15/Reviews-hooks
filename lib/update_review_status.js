'use strict';

const GithubApi = require('github4');
const denodeify = require('denodeify');
const uniq = require('lodash/uniq');

const client = new GithubApi({
  version: '3.0.0',
  timeout: 5000,
  headers: 'MyPeopleDoc Deploy Agent'
});

client.authenticate({
  type: 'oauth',
  token: process.env.GITHUB_TOKEN
});


module.exports = function(author, body, repo, name, sha) {
  return function(reviewers) {
    reviewers = uniq(reviewers);
    if (body.trim() === ':-1:' && reviewers.indexOf(author) !== -1) {
      denodeify(client.repos.createStatus)({
        user: repo,
        repo: name,
        sha: sha,
        state: 'failure',
        description: '@' + author + ' rejected the pull-request',
        context: 'Review my code - @' + author
      });
    }
    if (body.trim() === ':+1:' && reviewers.indexOf(author) !== -1) {
      denodeify(client.repos.createStatus)({
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
