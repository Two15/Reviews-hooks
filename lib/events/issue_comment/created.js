'use strict';

const client = require('../../github').client();
const merge = require('lodash/merge');

// var retrieveStatuses = require('../statuses');
const extractReviewRequests = require('../../extract_review_requests');
const updateReviewStatus = require('../../update_review_status');
const updateForcedReview = require('../../update_forced_review');
const applyStatuses = require('../../create_review_requests');
const dropMerged = require('../../drop_merged');
const getStatusForCommit = require('../../get_status_for_commit');
const denodeify = require('denodeify');

module.exports = function(payload) {
  var logger = this.log;
  const log = function(reason) {
    throw reason;
  };
  const repository = payload.repository;
  const user = repository.owner.login;
  const name = repository.name;
  const pr = payload.issue.pull_request;
  if (!pr) {
    return Promise.reject('Ignoring comment created not on a PR');
  }
  const prID = pr.url.split('/').pop();
  return denodeify(client.pullRequests.get)({
    user: user,
    repo: name,
    number: prID
  })
  .then(dropMerged)
  .then(function(pull) {
    var sha = pull.head.sha;
    // Create Statuses
    const requests = extractReviewRequests(payload.comment.body);
    const statuses = getStatusForCommit(user, name, sha);
    Promise.all([requests, statuses])
    .then(function(promises) {
      var reqs = promises[0];
      var statuses = promises[1];
      console.error(reqs);
      return merge({}, statuses, reqs);
    })
    .then(applyStatuses(user, name, sha), log);
    statuses.then(updateReviewStatus(payload.comment.user.login, payload.comment.body, user, name, sha), log);
    statuses.then(updateForcedReview(payload.comment.user.login, payload.comment.body, user, name, sha), log);
    return statuses;
  }).catch(log);
};
