'use strict';

const denodeify = require('denodeify');
const GithubApi = require('github4');
const findReviewers = require('../message_reader');
const createReviewRequests = require('../create_review_requests');

const client = new GithubApi({
  version: '3.0.0',
  timeout: 5000,
  headers: 'MyPeopleDoc Deploy Agent'
});

client.authenticate({
  type: 'oauth',
  token: process.env.GITHUB_TOKEN
});

module.exports = function(payload) {
  const message = payload.pull_request.body;
  const head = payload.pull_request.head;
  const repo = payload.repository;

  const sha = head.sha;
  const repoName = repo.name;
  const repoOwner = repo.owner.login;

  return findReviewers(message)
  .then(createReviewRequests(repoOwner, repoName, sha), function() {
    return denodeify(client.repos.createStatus)({
      user: repoOwner,
      repo: repoName,
      sha: sha,
      state: 'failure',
      description: 'You did not require code review',
      context: 'Review my code'
    });
  });
};
