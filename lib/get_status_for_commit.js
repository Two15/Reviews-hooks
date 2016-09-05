'use strict';

const client = require('./github').client();
const denodeify = require('denodeify');
var extractMentions = require('twitter-text').extractMentions;

module.exports = function(user, name, ref) {
  return denodeify(client.repos.getStatuses)({
    user: user,
    repo: name,
    sha: ref
  }).then(function(statuses) {
    return statuses.filter(function(s) {
      return s.context.startsWith("Review my code - @");
    }).reverse().reduce(function(memo, s) {
      const name = extractMentions(s.context).pop();
      memo[name.toLowerCase()] = {
        state: s.state,
        description: s.description,
        context: s.context
      };
      return memo;
    }, {});
  });
};
