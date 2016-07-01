'use strict';

const denodeify = require('denodeify');
const client = require('../../github').client();
const getStatusForCommit = require('../../get_status_for_commit');
const extractReviewRequests = require('../../extract_review_requests');
const applyStatuses = require('../../create_review_requests');
const merge = require('lodash/merge');

module.exports = function(payload) {
  var logger = this.log;
  const log = function(reason) {
    logger.info(reason);
  };

  const repo = payload.repository;
  const sha = payload.pull_request.head.sha;
  const repoName = repo.name;
  const repoOwner = repo.owner.login;

  return Promise.resolve(extractReviewRequests(payload.pull_request.body))
  .then(function(reviews) {
    return getStatusForCommit(repoOwner, repoName, sha)
    .then(function(statuses) {
      return merge({}, reviews, statuses);
    });
  })
  .then(applyStatuses(repoOwner, repoName, sha), log);
};
