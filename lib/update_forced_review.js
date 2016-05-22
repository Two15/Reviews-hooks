'use strict';

const compact = require('lodash/compact');
var extractMentions = require('twitter-text').extractMentions;

const regexp = /^!!FORCE\s+:[+-]1:\s+/;

module.exports = function(author, body) {
  return function(reviewers) {
    body = body.trim();
    if (body.match(regexp)) {
      var args = compact(body.split(' ')).reverse().slice(0, -1).reverse();
      var newStatus = args.shift();
      var updatedReviews = extractMentions(args.join(' ')).filter(function(reviewer) {
        return reviewer;
      });
      updatedReviews.forEach(function(reviewer) {
        if (newStatus.trim() === ':-1:') {
          reviewers[reviewer].state = 'failure';
          reviewers[reviewer].description = `@${author} rejected the pull-request for @${reviewer}`;
        }
        if (newStatus.trim() === ':+1:') {
          reviewers[reviewer].state = 'success';
          reviewers[reviewer].description = `@${author} accepted the pull-request for @${reviewer}`;
        }
      });
    }
    return reviewers;
  };
};
