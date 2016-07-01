'use strict';

const getStatusForCommit = require('../../get_status_for_commit');
const applyStatuses = require('../../create_review_requests');

module.exports = function(payload) {
  const repository = payload.repository;
  const user = repository.owner.login;
  const name = repository.name;
  const head = payload.pull_request.head;

  return getStatusForCommit(user, name, payload.before)
  .then(applyStatuses(user, name, head.sha));
};
