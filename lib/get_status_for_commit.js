'use strict';

const client = require('./github').client();
const denodeify = require('denodeify');
var extractMentions = require('twitter-text').extractMentions;

module.exports = function(user, name, sha) {
  return denodeify(client.repos.getStatuses)({
    user: user,
    repo: name,
    sha: sha
  }).then(function(statuses) {
    return statuses.filter(function(s) {
      return s.context.startsWith("Review my code - @");
    }).reduce(function(memo, s) {
      const name = extractMentions(s.context).pop();
      // TODO Check that the key is 'status'
      memo[name] = s.status;
      return memo;
    }, {});
  });
};
