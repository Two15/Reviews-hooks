'use strict';

var extractMentions = require('twitter-text').extractMentions;

module.exports = function(message) {
  var mentions = extractMentions(message.split('\n').filter(function(line) {
    return line.match(/^review:/);
  }).join(' '));
  if (mentions.length) {
    return Promise.resolve(mentions);
  }
  return Promise.reject();
};
