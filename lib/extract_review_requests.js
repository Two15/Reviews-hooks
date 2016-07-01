'use strict';

var extractMentions = require('twitter-text').extractMentions;

module.exports = function(message) {
  var reviewLines = message.split('\n').filter(function(line) {
    return line.trim().match(/^review:/);
  }).join(' ');
  var reviewStatus = extractMentions(reviewLines).reduce(function(memo, reviewer) {
    memo[reviewer] = {
      state: 'pending',
      description: `Waiting for the review`
    };
    return memo;
  }, {});
  return Promise.resolve(reviewStatus);
};
