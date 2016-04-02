'use strict';

const client = require('./github').client();
const denodeify = require('denodeify');
const uniq = require('lodash/uniq');
const compact = require('lodash/compact');
var extractMentions = require('twitter-text').extractMentions;

const regexp = /^!!FORCE\s+:[+-]1:\s+/;

module.exports = function(author, body, repo, name, sha) {
  return function(reviewers) {
    body = body.trim();
    reviewers = uniq(reviewers);
    if (body.match(regexp)) {
      var args = compact(body.split(' ')).reverse().slice(0, -1).reverse();
      var newStatus = args.shift();
      var updatedReviews = extractMentions(args.join(' ')).filter(function(reviewer) {
        return reviewers.indexOf(reviewer) !== -1;
      });
      updatedReviews.forEach(function(reviewer) {
        if (newStatus.trim() === ':-1:') {
          denodeify(client.repos.createStatus)({
            user: repo,
            repo: name,
            sha: sha,
            state: 'failure',
            description: '@' + author + ' rejected the pull-request for @' + reviewer,
            context: 'Review my code - @' + reviewer
          });
        }
        if (newStatus.trim() === ':+1:') {
          denodeify(client.repos.createStatus)({
            user: repo,
            repo: name,
            sha: sha,
            state: 'success',
            description: '@' + author + ' accepted the pull-request for @' + reviewer,
            context: 'Review my code - @' + reviewer
          });
        }
      });
    }
  };
};
