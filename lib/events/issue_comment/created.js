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
  const repository = payload.repository;
  const user = repository.owner.login;
  const name = repository.name;
  const pr = payload.issue.pull_request;

  const commentUser = payload.comment.user.login;
  const commentBody = payload.comment.body;

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
  .then(pull => pull.head.sha)
  .then(function(sha) {
    const statuses = getStatusForCommit(user, name, sha);
    const reviews = extractReviewRequests(commentBody);
    return Promise.all([reviews, statuses])
    .then(function(promises) {
      var revs = promises[0];
      var statuses = promises[1];
      return merge({}, statuses, revs);
    })
    .then(updateReviewStatus(commentUser, commentBody))
    .then(updateForcedReview(commentUser, commentBody))
    .then(applyStatuses(user, name, sha));
  });
};
