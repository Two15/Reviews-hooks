'use strict';

const denodeify = require('denodeify');
const client = require('../../github').client();
const extractReviewRequests = require('../../extract_review_requests');
const applyStatuses = require('../../create_review_requests');

module.exports = function(payload) {
  var logger = this.log;
  const log = function(reason) {
    logger.info(reason);
  };

  const repo = payload.repository;
  const sha = payload.pull_request.head.sha;
  const repoName = repo.name;
  const repoOwner = repo.owner.login;

  return extractReviewRequests(payload.pull_request.body)
    .then(applyStatuses(repoOwner, repoName, sha), log);
};
