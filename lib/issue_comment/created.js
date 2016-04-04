'use strict';

const client = require('../github').client();

// var retrieveStatuses = require('../statuses');
const findReviewers = require('../message_reader');
const updateReviewStatus = require('../update_review_status');
const updateForcedReview = require('../update_forced_review');
const createReviewRequests = require('../create_review_requests');
const denodeify = require('denodeify');
var extractMentions = require('twitter-text').extractMentions;

module.exports = function(payload) {
  var logger = this.log;
  const repository = payload.repository;
  const user = repository.owner.login;
  const name = repository.name;
  const prID = payload.issue.pull_request.url.split('/').pop();
  denodeify(client.pullRequests.get)({
    user: user,
    repo: name,
    number: prID
  })
  .then(function(pull) {
    var merged = pull.merged;
    if (merged) {
      return;
    }
    var sha = pull.head.sha;
    const log = function(reason) {
      logger.info(reason);
    };
    // Create Statuses
    findReviewers(payload.comment.body)
    .then(createReviewRequests(user, name, sha), log);
    const statuses = denodeify(client.repos.getStatuses)({
      user: user,
      repo: name,
      sha: sha
    }).then(function(statuses) {
      return statuses.filter(function(s) {
        return s.context.startsWith("Review my code - @");
      }).map(function(s) {
        return extractMentions(s.context).pop();
      });
    });
    statuses.then(updateReviewStatus(payload.comment.user.login, payload.comment.body, user, name, sha), log);
    statuses.then(updateForcedReview(payload.comment.user.login, payload.comment.body, user, name, sha), log);
    return statuses;
  });
};
